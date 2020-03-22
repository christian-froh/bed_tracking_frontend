import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-reader';
import { Tag } from './styles';

const REGISTER_BED = gql`
  mutation RegisterBed($input: RegisterBedInput!) {
    registerBed(input: $input) {
      bed {
        id
      }
    }
  }
`;

export const RegisterBed = () => {
  const [ id, setId ] = useState("");
  const [ bedId, setBedId ] = useState("");
  const [ camera, setCamera ] = useState(false);
  const [ registerBed ] = useMutation(REGISTER_BED);

  const handleClick = () => {
    registerBed({ 
      variables: { 
        input: { 
          hospitalId: "dddff394-412b-41bc-90f3-0000290e4a4a" 
        } 
      } 
    })
      .then(({ data }) => {
        console.log("am I here?")
        setId(data.registerBed.bed.id);
      });
  };

  const handleScan = ( id ) => {
    setBedId(id);
    setCamera(false);
  };

  return (
    <Tag>
      { camera && (
        <QrReader
          delay={300}
          onError={ (err) => { console.log(err) }}
          onScan={ handleScan }
        />
      )}
      <span>{bedId}</span>

      <button onClick={() => { setCamera(true) }}>SCAN QR</button>
      <button onClick={ handleClick }>Register bed</button>
      {id && <QRCode value={id} />}
    </Tag>
  )
}
