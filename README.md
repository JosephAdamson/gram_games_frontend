### How to 
- Clone the repo
- In the root folder run with `npm run dev`

### Stack
- Typescript
- React
- Vite (build tool)
- Tailwindcss (styling)
- Third Party
  - [Zod](https://zod.dev/). Had a lot of data that could be separated, thought this was the best for typing and type validation. First time uisng it.
  - [uuid](https://www.npmjs.com/package/uuid), for prop keys.
  - [Tanstack table](https://tanstack.com/table/latest/docs/framework/react/examples/basic), initially attempted to implememt my own table. Bit of a disaster, plus I would have been overkill for the task. First time using it.


### TODO

#### MVP
- [x] Display data in structured layout skeleton.
  - [x] Design layout and create app layout skeleton.
  - [x] Pipe in data.
- [ ] Support editing of values in data tables (top level and board data). Well, kind of, see BUG section.
- [x] Validate values on input.
- [x] Styling.

#### Bonus
- [ ] Add the ability to create, duplicate, or delete boards or quests.
  - [x] Add boards.
  - [x] Delete boards.
  - [x] Add Quests, Rewards, Golden Tiles.
  - [x] Delete Quests, Rewards, Golden Tiles.
  - [ ] Duplicate boards
  - [ ] Update Board state,
- [x] Highlight missing or malformed fields.
- [x] Use React Context or similar for managing app state.
- [x] Add toggles for “advanced” fields (e.g., target, target_type) that aren’t always needed.
- [x] Basic undo/redo or “reset to original JSON” functionality.

### Thoughts on how it could be extended/improved (if I had more time)
- Better dynamic table resizing (toggle columns on and off with media queries and useEffect)
- Testing: ordinarly if I had the time, I would try to do tests for each component. Preferably a TDD appraoch.
- Styling (e.g. better checkboxes smarter more intuitive table styles for validation)

### BUGS
- I really struggled with updating the cell state of my tables. Right now I keep track of what is typed locally and update a given board via a context hook on blur and the 'enter' keystroke. However the state resets itself on these conditions. Something I will have to look into.
  