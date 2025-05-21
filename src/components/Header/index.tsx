import Logo from "../../assets/logo.png";
import Restart from "../../assets/restart.svg";
import styles from "./styles.module.css";

type Props = {
  current: number;
  max: number;
  onRestart: () => void;
};

export function Header({ current, max, onRestart }: Props) {
  return (
    <div className={styles.container}>
      <img src={Logo} alt="logo da aplicação" />

      <header>
        <span>
          <strong> {current} </strong>de {max} tentativas
        </span>

        <button type="button" onClick={onRestart}>
          <img src={Restart} alt="Ícone de reiniciar" />
        </button>
      </header>
    </div>
  );
}
