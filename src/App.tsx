// Importações de módulos e componentes
import styles from "./App.module.css"; // Estilos CSS modularizados
import { WORDS, Challenge } from "./utils/words"; // Lista de palavras e tipo Challenge
import { useEffect, useState } from "react"; // Hooks do React

// Importação de componentes personalizados
import { Button } from "./components/Button";
import { Header } from "./components/Header";
import { Input } from "./components/Input";
import { Letter } from "./components/Letter";
import { LettersUsed, type LettersUsedProps } from "./components/LettersUsed";
import { Tip } from "./components/Tip";

// Componente principal da aplicação
function App() {
  // Estados do jogo:
  const [score, setScore] = useState(0); // Pontuação do jogador
  const [letter, setLetter] = useState(""); // Letra digitada pelo usuário
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([]); // Letras já utilizadas
  const [challenge, setChallenge] = useState<Challenge | null>(null); // Desafio atual (palavra + dica)
  const [shake, setShake] = useState(false);

  const attempts = 5;

  // Função para reiniciar o jogo (ainda não implementada completamente)
  const HandleRestarGame = () => {
    const isConfirmed = window.confirm(
      "Você tem certeza que deseja reiniciar o jogo?"
    );
    if (isConfirmed) {
      startGame(); // Inicia um novo jogo
    }
  };

  // Função chamada quando o usuário confirma uma letra
  const handleConfirm = () => {
    if (!challenge) {
      return; // Se não houver desafio, não faz nada
    }

    if (!letter.trim()) {
      alert("digite uma letra"); // Valida se a letra foi digitada
    }

    const value = letter.toUpperCase(); // Converte para maiúscula
    const exist = lettersUsed.find(
      (used) => used.value.toUpperCase() === value
    ); // Verifica se a letra já foi usada

    if (exist) {
      setLetter(""); // Limpa o input
      return alert("letra já utilizada"); // Impede letras repetidas
    }

    // Conta quantas vezes a letra aparece na palavra do desafio
    const hits = challenge.word
      .toUpperCase()
      .split("")
      .filter((char) => char === value).length;

    const correct = hits > 0; // Verifica se a letra existe na palavra

    const currentScore = score + hits; // Atualiza a pontuação

    // Atualiza o estado com a nova letra utilizada
    setLettersUsed((prevState) => [...prevState, { value, correct }]);
    setScore(currentScore); // Atualiza a pontuação
    setLetter(""); // Limpa o input

    if (!correct) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 300);
    }
  };

  // Função para iniciar um novo jogo
  const startGame = () => {
    const index = Math.floor(Math.random() * WORDS.length); // Escolhe uma palavra aleatória
    const randomWord = WORDS[index];

    setChallenge(randomWord); // Define o novo desafio
    setScore(0); // Reseta as tentativas
    setLetter(""); // Limpa a letra atual
    setLettersUsed([]); // Limpa as letras utilizadas
  };

  const endGame = (mensagem: string) => {
    alert(mensagem);
    startGame();
  };

  // Efeito que roda uma vez ao montar o componente para iniciar o jogo
  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (!challenge) {
      return;
    }

    setTimeout(() => {
      if (score === challenge.word.length) {
        return endGame("Parabéns, você ganhou!");
      }
      if (lettersUsed.length === challenge.word.length + attempts) {
        return endGame("Você perdeu!");
      }
    }, 1000);
  }, [score, lettersUsed.length]);

  // Se não houver desafio, não renderiza nada
  if (!challenge) {
    return;
  }

  // Renderização do componente
  return (
    <div className={styles.container}>
      <main>
        {/* Cabeçalho com contador de tentativas e botão de reinício */}
        <Header
          current={lettersUsed.length}
          max={challenge.word.length + attempts} // Limite de tentativas
          onRestart={HandleRestarGame}
        />

        {/* Exibe a dica da palavra */}
        <Tip tip={challenge.tip} />

        {/* Exibe os espaços para as letras da palavra (ainda não implementado completamente) */}
        <div className={`${styles.word} ${shake && styles.shake}`}>
          {challenge.word.split("").map((letter, index) => {
            const letterUsed = lettersUsed.find(
              (used) => used.value.toUpperCase() === letter.toUpperCase()
            );
            return (
              <Letter
                key={index}
                value={letterUsed?.value}
                color={letterUsed?.correct ? "correct" : "default"}
              />
            );
          })}
        </div>

        <h4>Palpite</h4>

        {/* Área de input para o usuário digitar uma letra */}
        <div className={styles.guess}>
          <Input
            autoFocus // Foca automaticamente no input
            maxLength={1} // Permite apenas 1 caractere
            placeholder="?"
            value={letter} // Valor controlado pelo estado 'letter'
            onChange={(e) => setLetter(e.target.value)} // Atualiza o estado quando digita
          />
          {/* Botão para confirmar a letra digitada */}
          <Button tittle="Confirmar" onClick={handleConfirm} />
        </div>

        {/* Exibe as letras já utilizadas e se estavam corretas */}
        <LettersUsed data={lettersUsed} />
      </main>
    </div>
  );
}

export default App;
