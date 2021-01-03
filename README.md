# LAIG 2020/2021

## Group T07G04
| Name             | Number    | E-Mail              |
| ---------------- | --------- | ------------------  |
| Joao Romao       | 201806779 | up201806779@fe.up.pt|
| Rafael Cristino  | 201806680 | up201806680@fe.up.pt|

----

## Projects

### [TP1 - Scene Graph](TP1)

- All features implemented and working well
- Error management
  - The parser will always try do draw the scene despite errors, showing warnings on the console.
- Textures, materials and transformations inheritance
  - Implemented material and texture stacks.
  - Use of push and pop functions to, respectively, save the current property and apply the property on the top of the stack.
- Scaling factors
  - Implemented on the rectangle and the triangle.
  - Use of a method 'updateTexCoords' to update the coords when drawing a given rectangle or triangle leaf.
- Scene
  - The created scene represents a Quidditch field from the Harry Potter saga.
  - [scene link](scenes/quidditch.xml)

-----

### [TP2 - Sprites, Animations and Surfaces](TP2)

- All features implemented and working well
- Implemented plane using NURBS, with scaling factors
- Transparent spritesheets
- Keyframe animations have the option to be repeated indefinitely
- All the features from the previous project apply, like the ability to draw the scene despite most errors
- Scene
  - The created scene represents a Quidditch field from the Harry Potter saga. Includes a battle animation made with keyframes and sprites, crazy tower flags made with keyframes and a tunnel made with the new barrel primitive. In addition, there are multiple perspectives available, including some that allow the viewing of demos of other functionalities.
  - [scene link](scenes/quidditch.xml)
----

### [TP3 - 3D Game Interface](TP3)
- All features implemented and working well.
- When the player selects a piece, the tiles to which he can move are highlighted.
- Implemented animations in the in game menus, game pieces and dragon caves. The game pieces are moved from point to point in an arc in the board, and the dragon caves spawn a dragon through a more complex animation. The menus animate in and out of the screen. The movement is also animated.
- Implemented menus with in-scene objects through the use of picking.
- Implemented in-game scene switching with 3 scenes to switch between.
- Undo is also well implemented in the interface, and when the game comes to an end, the game movie can be watched.
- Each player has 30 seconds to complete a move! If he doesn't complete it, it becomes the next player's turn.
- The amount of pieces eaten by each player are shown in the scoreboard.
- The game has 3 game moves, human vs human, human vs machine and machine vs machine. The modes with machines have 3 difficulties available to pick from.

