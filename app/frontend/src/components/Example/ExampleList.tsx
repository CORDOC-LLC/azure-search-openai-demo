import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const EXAMPLES: ExampleModel[] = [
    {
        text: "How to diagnose left ventricular non-compaction?",
        value: "How to diagnose left ventricular non-compaction?"
    },
    { text: "Is there a benefit of viability assessment prior to bypass?", value: "Is there a benefit of viability assessment prior to bypass?" },
    { text: "What are the indications of AVR in aortic regurgitation?", value: "What are the indications of AVR in aortic regurgitation?" }
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
