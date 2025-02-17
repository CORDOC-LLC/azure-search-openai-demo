import { useMemo, useEffect, useRef } from "react";
import { Stack, IconButton, Link } from "@fluentui/react";
import DOMPurify from "dompurify";

import styles from "./Answer.module.css";

import { AskResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";

interface Props {
    answer: AskResponse;
    isSelected?: boolean;
    azureData?: AzureData | null;
    onCitationClicked: (filePath: string) => void;
    onThoughtProcessClicked: () => void;
    onSupportingContentClicked: () => void;
    onFollowupQuestionClicked?: (question: string) => void;
    showFollowupQuestions?: boolean;
}

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

export const Answer = ({
    answer,
    isSelected,
    azureData,
    onCitationClicked,
    onThoughtProcessClicked,
    onSupportingContentClicked,
    onFollowupQuestionClicked,
    showFollowupQuestions
}: Props) => {
    const parsedAnswer = useMemo(() => parseAnswerToHtml(answer.answer, onCitationClicked), [answer]);
    const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml);
    const sanitizedAnswerHtmlRef = useRef<string>(sanitizedAnswerHtml);

    useEffect(() => {
        sanitizedAnswerHtmlRef.current = sanitizedAnswerHtml;
    }, [sanitizedAnswerHtml]);

    const shareAnswer = async () => {
        if (navigator.share) {
            try {
                const title = "CliniWiz: AI-based medical search tool";
                const plainTextMessage = `From guidelines: ${sanitizedAnswerHtmlRef.current} ~~~~~~~~~~~~~~~ From authentic sources: ${azureData?.answer}`;

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

    const getPlainTextContent = () => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = sanitizedAnswerHtmlRef.current;
        return tempDiv.textContent || tempDiv.innerText || "";
    };

    const plainTextContent = useMemo(() => getPlainTextContent(), []);
    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between">
                    <AnswerIcon />
                    <div>
                        <IconButton
                            style={{ color: "black" }}
                            iconProps={{ iconName: "Lightbulb" }}
                            title="Show thought process"
                            ariaLabel="Show thought process"
                            onClick={() => onThoughtProcessClicked()}
                            disabled={!answer.thoughts}
                        />
                        <IconButton
                            style={{ color: "black" }}
                            iconProps={{ iconName: "ClipboardList" }}
                            title="Show supporting content"
                            ariaLabel="Show supporting content"
                            onClick={() => onSupportingContentClicked()}
                            disabled={!answer.data_points.length}
                        />
                        <IconButton
                            id="shareButton"
                            style={{ color: "black" }}
                            iconProps={{ iconName: "Share" }}
                            title="Share answer"
                            ariaLabel="Share answer"
                            onClick={shareAnswer}
                        />
                    </div>
                </Stack>
            </Stack.Item>

            <Stack.Item grow>
                <div className={styles.answerText}>
                    <p>
                        <strong>From guidelines</strong>
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: sanitizedAnswerHtml }}></div>
                </div>
            </Stack.Item>

            {azureData && (
                <Stack.Item grow>
                    <div className={styles.answerText}>
                        <p>
                            <strong>Additional Authentic Information</strong>
                        </p>
                        <p>{azureData.answer}</p>
                    </div>
                </Stack.Item>
            )}

            {(!!parsedAnswer.citations.length || (azureData && azureData.documents.length > 0)) && (
                <Stack.Item>
                    <Stack horizontal wrap tokens={{ childrenGap: 5 }}>
                        <span className={styles.citationLearnMore}>Citations:</span>
                        <ul>
                            {parsedAnswer.citations.map((x, i) => {
                                const path = getCitationFilePath(x);
                                return (
                                    <li key={i}>
                                        <a className={styles.citation} title={x} onClick={() => onCitationClicked(path)}>
                                            {`${++i}. ${x}`}
                                        </a>
                                    </li>
                                );
                            })}
                            {azureData &&
                                azureData.documents.map((doc, index) => (
                                    <li key={index}>
                                        <a
                                            className={styles.citation}
                                            title={doc.metadata.page_title}
                                            onClick={e => {
                                                e.preventDefault();
                                                window.open(doc.metadata.source, "_blank");
                                            }}
                                            href={doc.metadata.source}
                                        >
                                            {`${doc.metadata.page_title} : ${doc.metadata.source}`}
                                        </a>
                                    </li>
                                ))}
                        </ul>
                    </Stack>
                </Stack.Item>
            )}

            {!!parsedAnswer.followupQuestions.length && showFollowupQuestions && onFollowupQuestionClicked && (
                <Stack.Item>
                    <Stack horizontal wrap className={`${!!parsedAnswer.citations.length ? styles.followupQuestionsList : ""}`} tokens={{ childrenGap: 6 }}>
                        <span className={styles.followupQuestionLearnMore}>Follow-up questions:</span>
                        {parsedAnswer.followupQuestions.map((x, i) => {
                            return (
                                <a key={i} className={styles.followupQuestion} title={x} onClick={() => onFollowupQuestionClicked(x)}>
                                    {`${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
            )}
        </Stack>
    );
};
