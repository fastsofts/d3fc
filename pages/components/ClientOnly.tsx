import { useEffect, useState } from 'react';
import css from '../../styles/ClientOnly.module.scss';
interface Props {
  children: React.ReactNode;
}

const ClientOnly: React.FC<Props> = ({ children, ...delegated }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div className={css.PageBackground} {...delegated}>{children}</div>;
};
export default ClientOnly;