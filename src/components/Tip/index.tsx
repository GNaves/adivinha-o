import styles from "./styles.module.css";
import Dica from "../../assets/tip.svg";

type Props = {
  tip: string;
};

export const Tip = ({ tip }: Props) => {
  return (
    <div className={styles.tip}>
      <img src={Dica} alt="ícone de dica" className={styles.icon} />

      <div>
        <h3>Dica</h3>
        <p>{tip}</p>
      </div>
    </div>
  );
};
