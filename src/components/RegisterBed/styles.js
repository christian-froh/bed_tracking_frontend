import styled from 'styled-components';
import { rem } from '../../utils/tools';
import QrReader from 'react-qr-reader';

export const Tag = styled.section`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  margin: 0 auto;
  max-width: 300px;
  padding: ${rem(15)};
`;

export const Scan = styled.button`
  background-color: ${props => props.theme.colors[0]};
  color: white;
  cursor: pointer;
  border: 0 none;
  font: 400 ${rem(20)}/1 ${props => props.theme.fonts[0]};
  height: ${rem(40)};
  outline: none;
  margin-bottom: ${rem(10)};
  text-transform: none;
  width: 100%;
`;

export const Register = styled.button``;

export const UpdateBed = styled.button``;

export const QRCam = styled(QrReader)`
  height: ${rem(270)};
  margin-bottom: ${rem(15)};
  width: 100%;
`;