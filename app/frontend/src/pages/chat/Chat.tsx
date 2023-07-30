import { useRef, useState, useEffect } from "react";
<<<<<<< HEAD
import { Checkbox, Panel, DefaultButton, TextField, SpinButton, Dropdown, IDropdownOption } from "@fluentui/react";
import { SparkleFilled } from "@fluentui/react-icons";
=======
import { Checkbox, Panel, DefaultButton, TextField, SpinButton, Link, Dropdown, IDropdownOption } from "@fluentui/react";
import { BookOpenFilled } from "@fluentui/react-icons";
>>>>>>> stream

import styles from "./Chat.module.css";

import { chatApi, RetrievalMode, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
<<<<<<< HEAD
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
=======
import { Answer, AnswerError, AnswerLoading, AzureData } from "../../components/Answer";
>>>>>>> stream
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { SettingsButton } from "../../components/SettingsButton";
import { ClearChatButton } from "../../components/ClearChatButton";
import { CosmosClient } from "@azure/cosmos";

const API_KEY = import.meta.env.VITE_API_KEY;
const SERVERLESS_FUNCTION_URL = `https://searchfuncpremium.azurewebsites.net/api/searchFunction?code=${API_KEY}`;

const Chat = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState<string>("");
<<<<<<< HEAD
    const [retrieveCount, setRetrieveCount] = useState<number>(3);
=======
    const [retrieveCount, setRetrieveCount] = useState<number>(10);
>>>>>>> stream
    const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>(RetrievalMode.Hybrid);
    const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState<boolean>(false);
    const [excludeCategory, setExcludeCategory] = useState<string>("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(true);

    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingChatApi, setIsLoadingChatApi] = useState<boolean>(false);
    const [isLoadingAzureFunction, setIsLoadingAzureFunction] = useState<boolean>(false);

    const [error, setError] = useState<unknown>();

    const [activeCitation, setActiveCitation] = useState<string>();
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [answers, setAnswers] = useState<[user: string, response: AskResponse][]>([]);
    const [azureData, setAzureData] = useState<AzureData | null>(null);
    const [azureAnswers, setAzureAnswers] = useState<[user: string, azureData: AzureData | null][]>([]);

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;
        error && setError(undefined);
        setIsLoadingChatApi(true);
        setIsLoadingAzureFunction(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);

<<<<<<< HEAD
        try {
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [...history, { user: question, bot: undefined }],
                approach: Approaches.ReadRetrieveRead,
                overrides: {
                    promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                    excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                    top: retrieveCount,
                    retrievalMode: retrievalMode,
                    semanticRanker: useSemanticRanker,
                    semanticCaptions: useSemanticCaptions,
                    suggestFollowupQuestions: useSuggestFollowupQuestions
=======
        const history: ChatTurn[] = answers.map((a, index) => ({
            user: a[0],
            bot: azureAnswers.length > index && azureAnswers[index][1]?.answer ? `${azureAnswers[index][1]?.answer} ${a[1].answer}` : a[1].answer
        }));

        const request: ChatRequest = {
            history: [...history, { user: question, bot: undefined }],
            approach: Approaches.ReadRetrieveRead,
            overrides: {
                promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                top: retrieveCount,
                retrievalMode: retrievalMode,
                semanticRanker: useSemanticRanker,
                semanticCaptions: useSemanticCaptions,
                suggestFollowupQuestions: useSuggestFollowupQuestions
            }
        };
        const chatApiPromise = chatApi(request);
        const historyString: string = JSON.stringify(history);
        const serverlessFunctionPromise = fetch(SERVERLESS_FUNCTION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: question, history: historyString })
        });

        chatApiPromise
            .then(result => {
                history.push({ user: question, bot: result.answer });
                setAnswers([...answers, [question, result]]);
                setIsLoadingChatApi(false);
            })
            .catch(e => {
                setError(e);
                setIsLoadingChatApi(false);
            });

        serverlessFunctionPromise
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
>>>>>>> stream
                }
                return response.json();
            })
            .then(data => {
                history.push({ user: question, bot: data.answer });
                setAzureAnswers([...azureAnswers, [question, data]]);
                setIsLoadingAzureFunction(false);
            })
            .catch(error => {
                console.error("Error calling Azure serverless function:", error);
                setIsLoadingAzureFunction(false);
            });

        try {
            // Await both promises.
            const [chatApiResult, serverlessFunctionResponse] = await Promise.all([chatApiPromise, serverlessFunctionPromise]);

            if (!serverlessFunctionResponse.ok) {
                throw new Error(`HTTP error! status: ${serverlessFunctionResponse.status}`);
            }

            // Extract the JSON data from the response
            const serverlessFunctionData = await serverlessFunctionResponse.json();

            // Concatenate answers from both chatApi and serverless function.
            const combinedAnswer = `${chatApiResult.answer} ${serverlessFunctionData.answer}`;

            // Add the combined answer to the history.
            history.push({ user: question, bot: combinedAnswer });

            // Create a mock AskResponse object for each ChatTurn in history.
            const mockResponses: [string, AskResponse][] = history.map(turn => [
                turn.user,
                {
                    answer: turn.bot || "", // Set default value
                    thoughts: "", // Mock thoughts
                    data_points: [] // Mock data_points
                    // Add more properties as necessary.
                }
            ]);

            setAnswers(mockResponses);

            setIsLoadingAzureFunction(false);
            setIsLoadingChatApi(false);

            const endpoint = import.meta.env.VITE_COSMOSDB_ENDPOINT;
            const key = import.meta.env.VITE_COSMOSDB_KEY;

            if (!endpoint || !key) {
                // Handle the case when the endpoint or key is missing
                throw new Error("Endpoint or key is missing");
            }
            const client = new CosmosClient({ endpoint, key });
            const databaseId = "ToDoList";
            const containerId = "Items";
            const database = client.database(databaseId);
            const container = database.container(containerId);
            const item = {
                question,
                result: chatApiResult.answer,
                resultFunc: serverlessFunctionData.answer,
                timestamp: new Date().toISOString(),
                website: "acc.cliniwiz.com"
            };

            container.items.create(item);
        } catch (e) {
            setError(e);
            setIsLoadingChatApi(false);
            setIsLoadingAzureFunction(false);
        }
    };

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
        setAzureAnswers([]);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), [isLoading]);

    const onPromptTemplateChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPromptTemplate(newValue || "");
    };

    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onRetrievalModeChange = (_ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<RetrievalMode> | undefined, index?: number | undefined) => {
        setRetrievalMode(option?.data || RetrievalMode.Hybrid);
    };

    const onUseSemanticRankerChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticRanker(!!checked);
    };

    const onUseSemanticCaptionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticCaptions(!!checked);
    };

    const onExcludeCategoryChanged = (_ev?: React.FormEvent, newValue?: string) => {
        setExcludeCategory(newValue || "");
    };

    const onUseSuggestFollowupQuestionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSuggestFollowupQuestions(!!checked);
    };

    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
    };

    const onShowCitation = (citation: string, index: number) => {
        if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveCitation(citation);
            setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        }

        setSelectedAnswer(index);
    };

    const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    return (
        <div className={styles.container}>
            <div className={styles.commandsContainer}>
                <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} />
                <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} />
            </div>
            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div className={styles.chatEmptyState}>
                            <BookOpenFilled fontSize={"60px"} primaryFill={"rgba(145, 5, 23, 1)"} aria-hidden="true" aria-label="Book logo" />
                            <h4 className={styles.chatEmptyStateTitle}>AI-Powered Medical Guidelines Search </h4>

                            {/* <h2 className={styles.chatEmptyStateSubtitle}>Ask anything or try an example</h2> */}
                            <ExampleList onExampleClicked={onExampleClicked} />
                        </div>
                    ) : (
                        <div className={styles.chatMessageStream}>
                            {answers.map((answer, index) => (
                                <div key={index}>
                                    <UserChatMessage message={answer[0]} />
                                    <div className={styles.chatMessageGpt}>
                                        <Answer
                                            key={index}
                                            answer={answer[1]}
                                            azureData={azureAnswers.length > index ? azureAnswers[index][1] : null}
                                            isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                            onCitationClicked={c => onShowCitation(c, index)}
                                            onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                            onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                            onFollowupQuestionClicked={q => makeApiRequest(q)}
                                            showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                        />
                                    </div>
                                </div>
                            ))}

                            {isLoadingAzureFunction && (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerLoading />
                                    </div>
                                </>
                            )}
                            <div ref={chatMessageStreamEnd} />
                        </div>
                    )}

                    <div className={styles.chatInput}>
                        <QuestionInput
                            clearOnSend
                            placeholder="Type a new question (e.g. is How to prevent trastuzumab-induced cardiotoxicity??)"
                            disabled={isLoading}
                            onSend={question => makeApiRequest(question)}
                        />
                    </div>
                </div>

                {answers.length > 0 && activeAnalysisPanelTab && (
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="756px"
                        answer={answers[selectedAnswer][1]}
                        activeTab={activeAnalysisPanelTab}
                    />
                )}

                <Panel
                    headerText="Configure answer generation"
                    isOpen={isConfigPanelOpen}
                    isBlocking={false}
                    onDismiss={() => setIsConfigPanelOpen(false)}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={() => <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>Close</DefaultButton>}
                    isFooterAtBottom={true}
                >
                    <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={promptTemplate}
                        label="Override prompt template"
                        multiline
                        autoAdjustHeight
                        onChange={onPromptTemplateChange}
                    />

                    <SpinButton
                        className={styles.chatSettingsSeparator}
                        label="Number of documents to be retrieved:"
                        min={1}
                        max={50}
                        defaultValue={retrieveCount.toString()}
                        onChange={onRetrieveCountChange}
                    />
                    <TextField className={styles.chatSettingsSeparator} label="Exclude category" onChange={onExcludeCategoryChanged} />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticRanker}
                        label="Use semantic ranker for retrieval"
                        onChange={onUseSemanticRankerChange}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticCaptions}
                        label="Use query-contextual summaries instead of whole documents"
                        onChange={onUseSemanticCaptionsChange}
                        disabled={!useSemanticRanker}
                    />
                    {/* <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSuggestFollowupQuestions}
                        label="Suggest follow-up questions"
                        onChange={onUseSuggestFollowupQuestionsChange}
                    /> */}
                    <Dropdown
                        className={styles.chatSettingsSeparator}
                        label="Retrieval mode"
                        options={[
                            { key: "hybrid", text: "Vectors + Text (Hybrid)", selected: true, data: RetrievalMode.Hybrid },
                            { key: "vectors", text: "Vectors", data: RetrievalMode.Vectors },
                            { key: "text", text: "Text", data: RetrievalMode.Text }
                        ]}
                        required
                        onChange={onRetrievalModeChange}
                    />
                    <Dropdown
                        className={styles.chatSettingsSeparator}
                        label="Retrieval mode"
                        options={[
                            { key: "hybrid", text: "Vectors + Text (Hybrid)", selected: retrievalMode == RetrievalMode.Hybrid, data: RetrievalMode.Hybrid },
                            { key: "vectors", text: "Vectors", selected: retrievalMode == RetrievalMode.Vectors, data: RetrievalMode.Vectors },
                            { key: "text", text: "Text", selected: retrievalMode == RetrievalMode.Text, data: RetrievalMode.Text }
                        ]}
                        required
                        onChange={onRetrievalModeChange}
                    />
                </Panel>
            </div>
        </div>
    );
};

export default Chat;
