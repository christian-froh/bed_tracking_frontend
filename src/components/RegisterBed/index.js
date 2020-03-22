import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import QRCode from 'qrcode.react';
import { Tag, Scan, Register, UpdateBed, QRCam } from './styles';

const REGISTER_BED = gql`
  mutation RegisterBed($input: RegisterBedInput!) {
    registerBed(input: $input) {
      bed {
        id
      }
    }
  }
`;

const GET_BED = gql`
  query GetBed($input: GetBedInput!){
    getBed(input: $input) {
      bed {
        hospital {
          name
        },
        available
      }
    }
  }
`;

const UPDATE_BED_AVAILABILITY = gql`
  mutation UpdateBedAvailability($input: UpdateBedAvailabilityInput!) {
    updateBedAvailability(input: $input) {
      bed {
        id,
        available
      }
    }
  }
`;

export const RegisterBed = () => {
  const [ id, setId ] = useState("");
  const [ bedId, setBedId ] = useState("");
  const [ camera, setCamera ] = useState(false);
  const [ bedAvailability, setBedAvailability ] = useState(true);
  const [ registerBed ] = useMutation(REGISTER_BED);
  const [ updateBedAvailability ] = useMutation(UPDATE_BED_AVAILABILITY);
  const [ getBed, { data } ] = useLazyQuery(GET_BED);

  const handleClick = () => {
    registerBed({ 
      variables: { 
        input: { 
          hospitalId: "dddff394-412b-41bc-90f3-0000290e4a4a" 
        } 
      } 
    })
      .then(({ data }) => {
        setId(data.registerBed.bed.id);
      });
  };

  const handleScan = ( id ) => {
    // const token = '364d453f-85d0-4d22-a3e3-bf9e4488b99b';

    // if(token) {
    if(id) {
      // setBedId(token);
      setBedId(id);
      setCamera(false);
      getBed({
        // variables: { input: { id: token } }
        variables: { input: { id } }
      })
    }
  };

  const handleUpdateAvailability = () => {
    updateBedAvailability({
      variables: {
        input: {
          available: !bedAvailability,
          id: bedId
        }
      }
    })
      .then(({ data }) => {
        console.log(data)
        setBedAvailability(data.updateBedAvailability.bed.available);
      });
  }

  useEffect(() => {
    if(data) {
      setBedAvailability(data.getBed.bed.available);
    }
  }, [ data ])

  return (
    <Tag>
      { camera && (
        <QRCam
          delay={300}
          onError={ (err) => { console.log(err) }}
          onScan={ handleScan }
        />
      )}
      <Scan onClick={() => { setCamera(true) }}>Scan QR</Scan>
      <Register onClick={ handleClick }>Register bed</Register>
      { id && <QRCode value={id} /> }
      { data && (
        <UpdateBed onClick={ handleUpdateAvailability }>
          { bedAvailability ? 'Set busy' : 'Set free' }
        </UpdateBed>
      )}
    </Tag>
  )
}
