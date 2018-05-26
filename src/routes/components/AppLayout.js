import styled from 'styled-components';

// the general app layout where we set the display to type grid.
// height is 100 view port height, 3 columns - 100px, 250px and the rest.
// the columns are 100px, 250px and the remaining.
// the rows are equally divided
export default styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: 100px 250px 1fr;
  grid-template-rows: auto 1fr auto;
`;
