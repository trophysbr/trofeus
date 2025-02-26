import styled from 'styled-components';

export const FormContainer = styled.form`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #1e1e2e;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1rem;
    margin: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:nth-last-child(2) {
    grid-column: 1 / -1;
  }

  &:last-child {
    grid-column: 1 / -1;
  }
`;

export const Label = styled.label`
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #2d3436;
  background-color: #0f0f1a;
  color: white;
  font-size: 1rem;
  width: 100%;
  
  &::placeholder {
    color: #a0a0a0;
  }
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }

  ${props => props.as === 'textarea' && `
    resize: vertical;
    min-height: 100px;
  `}
`;

export const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #2d3436;
  background-color: #0f0f1a;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
  
  option {
    background-color: #0f0f1a;
    color: white;
    padding: 0.5rem;
  }
`;

export const Button = styled.button`
  padding: 1rem;
  border-radius: 8px;
  border: none;
  background-color: #6c5ce7;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  grid-column: 1 / -1;
  margin-top: 1rem;
  
  &:hover {
    background-color: #5849c2;
  }
  
  &:disabled {
    background-color: #4a4a6a;
    cursor: not-allowed;
  }
`;

export const ImagePreview = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 0.5rem;
`;

export const ErrorMessage = styled.div`
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  grid-column: 1 / -1;
  text-align: center;
  background-color: rgba(255, 77, 77, 0.1);
  padding: 0.5rem;
  border-radius: 4px;
`; 