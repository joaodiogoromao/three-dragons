# LAIG 2020/2021 - TP1

## Group T07G04

| Name             | Number    | E-Mail              |
| ---------------- | --------- | ------------------  |
| Joao Romao       | 201806779 | up201806779@fe.up.pt|
| Rafael Cristino  | 201806680 | up201806680@fe.up.pt|

----
## Project information

- Error management
  - The parser will always try do draw the scene despite errors, showing warnings on the console.
- Textures, materials and transformations inheritance
  - Implemented material and texture stacks.
  - Use of push and pop functions to, respectively, save the current property and apply the previous property.
- Scaling factors
  - Implemented on the rectangle and the triangle.
  - Use of a method 'updateTexCoords' to update the coords when drawing a given rectangle or triangle leaf.
- Scene
  - The created scene represents a Quidditch field from the Harry Potter saga.
  - It contains representations of all the primitives:
    - *Torus* - present in the field delimiting object and in the field hoops.
    - *Cylinder* - present in the hoop poles and flag poles.
    - *Sphere* - present in the flag placed on the top of each tower.
    - *Triangle and Rectangle* - both present in the structure of each tower and, the tent placed outside of the field and the flag on top of the towers.
  - The scene also has different cameras pointing to objects that represent features that were not easy to observe on the main scene:
    - Scale factors.
    - Cylinder with basis of different sizes.
    - Cylinder texture coordinates.
  - [scene link](scenes/quidditch.xml)
----
## Issues/Problems

- All features have been implemented and are working accordingly.
