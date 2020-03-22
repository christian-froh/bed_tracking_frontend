import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-reader';

const REGISTER_BED = gql`
  mutation RegisterBed($input: RegisterBedInput!) {
    registerBed(input: $input) {
      bed {
        id
      }
    }
  }
`;

const RegisterBed = () => {
  const [id, setId] = useState("");
  const [registerBed, { data }] = useMutation(REGISTER_BED);

  const handleClick = () => {
    registerBed({ variables: { input: { hospitalId: "dddff394-412b-41bc-90f3-0000290e4a4a" } } })
      .then(({ data }) => {
        setId(data.registerBed.bed.id);
      });
  }

  return (
    <>
      <QrReader
        delay={300}
        onScan={setId}
        style={{ width: '100%' }}
      />

      <button onClick={handleClick}>Register bed</button>
      {id && <QRCode value={id} />}
    </>
  )
}

export default RegisterBed;
