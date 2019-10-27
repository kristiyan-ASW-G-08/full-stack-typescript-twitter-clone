import { FC } from 'react';
import { createPortal } from 'react-dom';
import usePortal from 'hooks/usePortal/usePortal';

interface PortalProps {
  portalId: string;
  children: JSX.Element[] | JSX.Element;
}

const Portal: FC<PortalProps> = ({ portalId, children }) => {
  const target = usePortal(portalId);
  return createPortal(children, target);
};

export default Portal;
