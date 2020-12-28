:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),

		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),

		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),

		write('Finished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.

close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),

	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),

	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).

read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
:- consult('game.pl').


atom_from_number_chars([ListH|ListT], Out) :-
	atom_from_number_chars(ListT, IntermediateOut),
	atom_concat(ListH, IntermediateOut, Out).

atom_from_number_chars([], '').

json_atom(Atom, Out) :-
	atom_concat('"', Atom, Intermediate),
	atom_concat(Intermediate, '"', Out).

json_list([ListH|ListT], [OutH|OutT]) :-
	compound(ListH), is_list(ListH), !,
	json_list(ListH, OutH),
	json_list(ListT, OutT).

json_list([ListH|ListT], [OutH|OutT]) :-
	compound(ListH), \+ is_list(ListH), !,
	ListH =.. L,
	json_list(L, OutH),
	json_list(ListT, OutT).

json_list([ListH|ListT], [OutH|OutT]) :-
	\+ compound(ListH), number(ListH), !,
	number_chars(ListH, NumberChars),
	atom_from_number_chars(NumberChars, OutH),
	json_list(ListT, OutT).

json_list([ListH|ListT], [OutH|OutT]) :-
	\+ compound(ListH), \+ number(ListH), !,
	json_atom(ListH, OutH),
	json_list(ListT, OutT).

json_list([], []).

move_array_to_arrays([move(position(X1, Y1), position(X2, Y2), Piece)|MovesT], [OutH|OutT]) :-
	json_list([Piece], [PieceJSON]),
	OutH = {
		'"initial"': {
			'"x"': X1, 
			'"y"': Y1
		},
		'"final"': { 
			'"x"': X2, 
			'"y"': Y2 
		},		
		'"piece"': PieceJSON
	},
	move_array_to_arrays(MovesT, OutT).
move_array_to_arrays([], []).

% gets the initial game state
parse_input(initial, Reply) :-
	initial(game_state(Player, npieces(NPiecesWhite, NPiecesBlack), GameBoard)),
	json_list(GameBoard, GameBoardJSON),
	json_atom(Player, PlayerJSON),

	Reply = {
		'"player"': PlayerJSON,
		'"npieces"': [NPiecesWhite, NPiecesBlack],
		'"gameboard"': GameBoardJSON
	}.

% get all possible moves
parse_input(moves/[Player, [NPiecesWhite, NPiecesBlack], GameBoard], Reply) :-
	valid_moves(game_state(_Player, _NPieces, GameBoard), Player, ValidMoves),
	move_array_to_arrays(ValidMoves, Moves),
	write(ValidMoves),
	Reply = {
		'"moves"': Moves
	}.

% regular move
parse_input(move/[Player, [NPiecesWhite, NPiecesBlack], GameBoard]/[MoveX1, MoveY1, MoveX2, MoveY2, Piece], Reply) :-
	write("hello world!"), nl,
	Move = move(position(MoveX1, MoveY1), position(MoveX2, MoveY2), Piece),
	GameState = game_state(Player, npieces(NPiecesWhite, NPiecesBlack), GameBoard),
	move(GameState, Move, game_state(NewPlayer, npieces(NewNPiecesWhite, NewNPiecesBlack), NewGameBoard)),
	json_list(NewGameBoard, NewGameBoardJSON),
	json_atom(NewPlayer, NewPlayerJSON),
	write(NewPlayerJSON), nl,
	write(NewGameBoardJSON), nl,
	Reply = {
		'"player"': NewPlayerJSON,
		'"npieces"': [NewNPiecesWhite, NewNPiecesBlack],
		'"gameboard"': NewGameBoardJSON
	}.

parse_input(move/bot/[Player, [NPiecesWhite, NPiecesBlack], GameBoard]/Level, Reply) :-
	GameState = game_state(Player, npieces(NPiecesWhite, NPiecesBlack), GameBoard),
	choose_move(GameState, Player, Difficulty, BotMove),
	move(GameState, BotMove, game_state(NewPlayer, npieces(NewNPiecesWhite, NewNPiecesBlack), NewGameBoard)),
	json_list(NewGameBoard, NewGameBoardJSON),
	json_atom(NewPlayer, NewPlayerJSON),

	Reply = {
		'"player"': NewPlayerJSON,
		'"npieces"': [NewNPiecesWhite, NewNPiecesBlack],
		'"gameboard"': NewGameBoardJSON
	}.



parse_input(handshake, handshake).
parse_input(quit, goodbye).

test(_,[],N) :- N =< 0.
test(A,[A|Bs],N) :- N1 is N-1, test(A,Bs,N1).
