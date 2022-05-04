import styled from 'styled-components';

export  const Wrapper =  styled.div`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    width: 100%;
    border: 1px solid lightblue;
    border-radius: 20px;
    height: 100%;

    button {
        border-radius: 0 0 20px 20px;
        margin: 0 20px 20px 20px;
        background-color: tomato;
        font-weight: 600;
    }

    img {
        max-height: 250px;
        object-fit: cover;
        border-radius: 20px;
        padding: 1rem;
    }

    div {
        font-family: Arial, Helvetica, sans-serif;
        padding: 1rem;
        height: 100%;
    }
`;