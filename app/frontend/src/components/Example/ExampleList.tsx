import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const EXAMPLES: ExampleModel[] = [
    {
        text: "How to manage cardiac dysfunction during anthracycline therapy?",
        value: "How to manage cardiac dysfunction during anthracycline therapy?"
    },
    { text: "How to prevent atrial fibrillation?", value: "How to prevent atrial fibrillation?" },
    { text: "Which trials support using beta-blockers for heart failure?", value: "Which trials support using beta-blockers for heart failure?" }
];

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
    return (
        <ul className={styles.examplesNavList}>
            {EXAMPLES.map((x, i) => (
                <li key={i}>
                    <Example text={x.text} value={x.value} onClick={onExampleClicked} />
                </li>
            ))}
        </ul>
    );
};
