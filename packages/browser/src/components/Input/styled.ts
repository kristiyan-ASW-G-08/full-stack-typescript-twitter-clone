import styled from 'styled-components';

export const InputWrapper = styled('div')`
  width: 100%;
  input,
  textarea {
    padding: 0.7rem;
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    border-radius: 0.5rem;
    width: 100%;
    background-color: ${({ theme }) => theme.light};
    color: ${({ theme }) => theme.secondary};
    ::placeholder {
      color: ${({ theme }) => theme.dark};
    }
  }
  textarea {
    height: 10rem;
  }
  label {
    display: block;
    padding: 1rem;
    color: ${({ theme }) => theme.like};
    font-size: 1.3rem;
    font-weight: bold;
  }

  img {
    width: 100%;
    height: 10rem;
    object-fit: cover;
  }
`;

export default InputWrapper;
