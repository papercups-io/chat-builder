import styled from '@emotion/styled';

const Box = styled.div((props) => ({
  color: '#fff',
  backgroundColor: '#212529',
  backgroundClip: 'padding-box',
  borderImageOutset: 2,
  borderImageRepeat: 'stretch',
  borderImageSlice: 2,
  borderImageSource: `url('data:image/svg+xml;utf8,<?xml version="1.0" encoding="UTF-8" ?><svg version="1.1" width="5" height="5" xmlns="http://www.w3.org/2000/svg"><path d="M2 1 h1 v1 h-1 z M1 2 h1 v1 h-1 z M3 2 h1 v1 h-1 z M2 3 h1 v1 h-1 z" fill="rgb(33,37,41)" /></svg>')`,
  borderImageWidth: 2,
  borderStyle: 'solid',
  borderWidth: '4px',
  padding: '0.5rem 1rem',
  ...props.style,
}));

export default Box;
