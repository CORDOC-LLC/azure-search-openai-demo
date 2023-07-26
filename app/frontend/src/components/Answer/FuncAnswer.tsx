import { useMemo, useEffect, useRef } from "react";
import { Stack, IconButton, Link } from "@fluentui/react";
import DOMPurify from "dompurify";

import styles from "./Answer.module.css";

import { AskResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";

interface Document {
    page_content: string;
    metadata: {
        source: string;
        page_title: string;
    };
}

export interface AzureData {
    answer: string;
    data_points: string[];
    thoughts: string[];
    documents: Document[];
    // add other properties as needed
}

interface FuncAnswerProps {
    azureData: AzureData | null;
}

export const FuncAnswer: React.FC<FuncAnswerProps> = ({ azureData }) => {
    if (!azureData) return null; 

    const shareFuncAnswer = async () => {
        if (navigator.share) {
            try {
                const title = "CliniWiz: AI-based medical search tool";
                const plainTextMessage = `${azureData.answer}`;

                await navigator.share({
                    title,
                    text: plainTextMessage,
                    url: window.location.href
                });

                console.log("Shared successfully");
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            console.log("Share API not supported");
        }
    };

    return (
        <Stack className={`${styles.answerContainer}`}>
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between">
                    <AnswerIcon />
                    <div>
                        <IconButton
                            style={{ color: "black" }}
                            iconProps={{ iconName: "Lightbulb" }}
                            title="Show thought process"
                            ariaLabel="Show thought process"
                            onClick={() => {}}
                            disabled={!azureData.thoughts}
                        />
                        <IconButton
                            style={{ color: "black" }}
                            iconProps={{ iconName: "ClipboardList" }}
                            title="Show supporting content"
                            ariaLabel="Show supporting content"
                            onClick={() => {}}
                            disabled={!azureData.data_points.length}
                        />
                        <IconButton
                            id="shareButton"
                            style={{ color: "black" }}
                            iconProps={{ iconName: "Share" }}
                            title="Share answer"
                            ariaLabel="Share answer"
                            onClick={shareFuncAnswer}
                        />
                    </div>
                </Stack>
            </Stack.Item>

            <Stack.Item grow>
    <div className={styles.answerText}>
        <p><strong>Additional Authentic Information</strong></p>
        <p>{azureData.answer}</p>
        <p className={styles.citationLearnMore}>References:</p>
        <ul>
            {azureData.documents.map((doc, index) => (
                <li key={index}>
                    <Link href={doc.metadata.source} target="_blank">
                        {doc.metadata.page_title}
                    </Link>: <Link href={doc.metadata.source} target="_blank">
                        {doc.metadata.source}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
</Stack.Item>


        </Stack>
    );
};
