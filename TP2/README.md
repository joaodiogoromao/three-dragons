# LAIG 2020/2021 - TP2

## Group T07G04

| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Joao Romao       | 201806779 | up201806779@fe.up.pt |
| Rafael Cristino  | 201806680 | up201806680@fe.up.pt |

----
## Project information

- Implemented plane using NURBS, with scaling factors
- Transparent spritesheets
- Keyframe animations have the option to be repeated indefinitely
- All the features from the previous project apply, like the ability to draw the scene despite most errors
- Scene
  - The created scene represents a Quidditch field from the Harry Potter saga.
  - It contains representations of all the new primitives using NURBS:
    - *Plane* - present in the structure of each tower and, the tent placed outside of the field. Every rectangle present on the scene correspondent to the TP1 has been replaced by a plane.
    - *Patch* - present in the barrel structure.
    - *Barrel* - present in the tunnel that connects the tent to the field.
  - Includes a battle animation made with keyframes and sprites, crazy tower flags made with keyframes and a tunnel made with the new barrel primitive.
  - The scene also has different cameras pointing to objects that represent features that were not easy to observe on the main scene:
    - Scale factors of the plane primitive.
    - Different 'Patch' nodes with various shapes.
    - Barrel with middle and basis radius of different sizes.
  - [scene link](scenes/quidditch.xml)
----
## Issues/Problems

- All features have been implemented and are working accordingly. We didn't find any bugs during our final testing.
