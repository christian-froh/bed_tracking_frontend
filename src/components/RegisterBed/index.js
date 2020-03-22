import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import QRCode from "qrcode.react";
import {
  Tag,
  Scan,
  Register,
  UpdateBed,
  DeactivateBedButton,
  ActivateBedForm,
  InputReference,
  ActivateBedButton,
  QRCam,
  PrintBtn
} from "./styles";

const REGISTER_BED = gql`
  mutation RegisterBed($input: RegisterBedInput!) {
    registerBed(input: $input) {
      bed {
        id
      }
    }
  }
`;

const DEACTIVATE_BED = gql`
  mutation DeactivateBed($input: DeactivateBedInput!) {
    deactivateBed(input: $input) {
      bed {
        id
        active
      }
    }
  }
`;

const GET_BED = gql`
  query GetBed($input: GetBedInput!) {
    getBed(input: $input) {
      bed {
        hospital {
          name
        }
        available
        reference
        active
      }
    }
  }
`;

const ACTIVATE_BED = gql`
  mutation ActivateBed($input: ActivateBedInput!) {
    activateBed(input: $input) {
      bed {
        id
        active
        available
      }
    }
  }
`;

const UPDATE_BED_AVAILABILITY = gql`
  mutation UpdateBedAvailability($input: UpdateBedAvailabilityInput!) {
    updateBedAvailability(input: $input) {
      bed {
        id
        available
      }
    }
  }
`;

export const RegisterBed = () => {
  const [id, setId] = useState("");
  const [bedId, setBedId] = useState("");
  const [bedReference, setBedReference] = useState("");
  const [camera, setCamera] = useState(false);
  const [bedActive, setBedActive] = useState(false);
  const [bedAvailability, setBedAvailability] = useState(true);
  const [registerBed] = useMutation(REGISTER_BED);
  const [activateBed] = useMutation(ACTIVATE_BED);
  const [deactivateBed] = useMutation(DEACTIVATE_BED);
  const [updateBedAvailability] = useMutation(UPDATE_BED_AVAILABILITY);
  const [getBed, { data: dataGetBed }] = useLazyQuery(GET_BED);

  const handleClick = () => {
    registerBed({
      variables: {
        input: {
          hospitalId: "dddff394-412b-41bc-90f3-0000290e4a4a"
        }
      }
    }).then(({ data }) => {
      setId(data.registerBed.bed.id);
    });
  };

  const handleScan = id => {
    // const token = "1d9b2be5-8434-4e95-931e-6d8d1820b5a3";

    // if (token) {
    if (id) {
      // setBedId(token);
      setBedId(id);
      setCamera(false);
      getBed({
        // variables: { input: { id: token } }
        variables: { input: { id } }
      });
    }
  };

  const handleActivateBedForm = e => {
    activateBed({
      variables: {
        input: {
          id: bedId,
          reference: bedReference
        }
      }
    }).then(({ data }) => {
      setBedActive(data.activateBed.bed.active);
      setBedAvailability(data.activateBed.bed.available);
    });
  };

  const handleActivateBedReference = e => {
    setBedReference(e.target.value);
  };

  const handleUpdateAvailability = () => {
    updateBedAvailability({
      variables: {
        input: {
          available: !bedAvailability,
          id: bedId
        }
      }
    }).then(({ data }) => {
      setBedAvailability(data.updateBedAvailability.bed.available);
    });
  };

  const handleDeactivateBed = () => {
    deactivateBed({
      variables: {
        input: {
          id: bedId
        }
      }
    }).then(({ data }) => {
      setBedActive(data.deactivateBed.bed.active);
    });
  };

  useEffect(() => {
    if (dataGetBed) {
      setBedAvailability(dataGetBed.getBed.bed.available);
      setBedActive(dataGetBed.getBed.bed.active);
    }
  }, [dataGetBed]);

  return (
    <Tag>
      {camera && (
        <QRCam
          delay={300}
          onError={err => {
            console.log(err);
          }}
          onScan={handleScan}
        />
      )}
      <Scan
        onClick={() => {
          setCamera(true);
        }}
      >
        Scan QR
      </Scan>
      {dataGetBed && !bedActive && (
        <ActivateBedForm onSubmit={handleActivateBedForm}>
          <InputReference
            onChange={handleActivateBedReference}
            placeholder="Referenznummer*"
            autoFocus
          />
          <ActivateBedButton>Bett aktivieren</ActivateBedButton>
        </ActivateBedForm>
      )}
      {dataGetBed && bedActive && (
        <>
          <UpdateBed onClick={handleUpdateAvailability}>
            {bedAvailability ? "Bett belegen" : "Bett verfügbar"}
          </UpdateBed>
          <DeactivateBedButton onClick={handleDeactivateBed}>
            Bett entfernen
          </DeactivateBedButton>
        </>
      )}
      <Register onClick={handleClick}>Covid Bett registrieren</Register>
      {id && <QRCode value={id} />}
      {id && <PrintBtn>QR Code drucken</PrintBtn>}
    </Tag>
  );
};
