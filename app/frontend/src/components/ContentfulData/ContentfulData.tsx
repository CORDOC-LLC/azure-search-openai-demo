import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from "./ContentfulData.module.css";

interface ContentfulEntry {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    description: string;
    longDescription: string;
  };
}

export const ContentfulData: React.FC = () => {
  const [entry, setEntry] = useState<ContentfulEntry | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ContentfulEntry>(
          'https://cdn.contentful.com/spaces/fhrqoi3mjrin/environments/master/entries/29MCM0hixXBQLJAtX35w5e?access_token=z6jLmqUqQS2FLD05RF4VbnaVpGoJqV7MTyc2VqoGoF4'
        );


        setEntry(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!entry) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.centeredcontainer}>
      <h5>{entry.fields.title} </h5>
      <h5>{entry.fields.description}</h5>
      <p>{entry.fields.longDescription}</p>
    </div>
  );
};

export default ContentfulData;
