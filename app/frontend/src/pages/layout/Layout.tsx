import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

import { Panel, DefaultButton } from "@fluentui/react";
import { BookOpenFilled } from "@fluentui/react-icons";
import {ContentfulData} from '../../components/ContentfulData';

/* import github from "../../assets/github.svg";*/

import styles from "./Layout.module.css";
import { PopupButton } from "@typeform/embed-react";

const Layout = () => {
    const [isNaviPanelOpen, setIsNaviPanelOpen] = useState(false);
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="/" className={styles.headerTitleContainer}>
                        <BookOpenFilled fontSize={"20px"} primaryFill={"rgba(145, 5, 23, 1)"} aria-hidden="true" aria-label="Book logo" className={styles.githubLogo} />

                        <h3 className={styles.headerTitle}>CliniWiz</h3>
                    </Link>
                 
                    <a className={styles.headerRightText} onClick={() => setIsNaviPanelOpen(!isNaviPanelOpen)}>About </a>
                    <Panel
                        headerText="About"
                        isOpen={isNaviPanelOpen}
                        isBlocking={false}
                        onDismiss={() => setIsNaviPanelOpen(false)}
                        closeButtonAriaLabel="Close"
                        onRenderFooterContent={() => <DefaultButton onClick={() => setIsNaviPanelOpen(false)}>Close</DefaultButton>}
                        isFooterAtBottom={true}
                    >

                        <p>Welcome to our web app designed to assist clinicians in looking up guidelines using OpenAI-based artificial intelligence. Our platform offers a range of benefits to enhance your clinical practice while acknowledging certain limitations.</p>

                        <h3>Benefits:</h3>
                        <ul>
                            <li>Quick answer lookup: Our AI-powered system provides clinicians rapid access to relevant guidelines. You can easily search for specific queries and receive concise answers in seconds.</li>
                            <li>Direct link to exact guidelines: We go a step further by providing a direct link to the exact page of the guidelines that address your query. This saves you valuable time by taking you directly to the most relevant information.</li>
                            <li>Link to full-text guidelines: Besides quick answers, we offer links to the full guidelines. This allows clinicians to delve deeper into the details and explore comprehensive information related to their specific topics of interest.</li>
                            <li>Curated by a clinician: Our content is meticulously curated by experienced clinicians who understand the nuances of medical practice. This ensures that the guidelines provided are reliable, accurate, and trustworthy.</li>
                        </ul>

                        <h3>Limitations:</h3>
                        <ul>
                            <li>Occasional inadequate information: While our AI system strives to provide comprehensive answers, there may be instances where the information provided may be incomplete or insufficient. Clinicians should exercise their judgment and consider consulting additional sources when necessary.</li>
                            <li>Basic medical knowledge required: As with any tool, a foundational understanding of medical concepts is necessary to interpret and comprehend the answers provided. Our app is intended to supplement clinical knowledge rather than replace it.</li>
                            <li>Expert supervision for patient care: It is essential to note that our web app should not be used as a standalone resource for patient care decisions. It should always be utilized under the guidance and supervision of qualified healthcare professionals who possess expert clinical judgment.</li>
                        </ul>
                        <p>Best viewed on a large screen device. For an optimal experience, we recommend using a laptop, desktop or a tablet. </p>
                        <p>Powered by OpenAI. Contact us at info@cliniwiz.com</p>

                    </Panel>
                </div>
            </header>
            <Outlet />

            <ContentfulData />
            <footer className={styles.footer}>
                <div className={styles.footerRow}>
                    <PopupButton id="Aqe8mZV0" style={{ fontSize: 16, buttonText: "Subscribe" }} className="my-button">
                        Subscribe
                    </PopupButton>
                    <PopupButton id="leXMifm0" style={{ fontSize: 16, buttonText: "Donate" }} className="my-button">
                        Donate
                    </PopupButton>
                    <PopupButton id="TUmwePjl" style={{ fontSize: 16, buttonText: "Feedback" }} className="my-button">
                        Feedback
                    </PopupButton>

                </div>
                <div className={styles.footerRow}>
                    <a href="https://docs.cliniwiz.com/acknowledgments/" className="my-link">Acknowledgments</a>
                    <a href="https://docs.cliniwiz.com/privacy-policy/" className="my-link">Privacy Policy</a>
                    <a href="https://docs.cliniwiz.com/cookie-policy/" className="my-link">Cookie Policy</a>
                    <a href="https://docs.cliniwiz.com/disclaimer/" className="my-link">Disclaimer</a>
                </div>
                <div className={styles.footerRow}>
                    <p>&copy; 2023 CORDOC LLC. All rights reserved. </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
