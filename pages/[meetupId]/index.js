import MeetupDetail from '../../components/meetups/MeetupDetail';
import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

function MeetupDetails(props) {
    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description" content={props.meetupData.description} />
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    );
}

//
export async function getStaticPaths() {
    const client = await MongoClient.connect(
        'mongodb+srv://nextjs:nextjs@cluster0.bmldpko.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupCollection = db.collection('meetups');

    const meetups = await meetupCollection.find({}, { _id: 1 }).toArray();

    client.close();

    return {
        fallback: false, // true면 동적
        paths: meetups.map((meetup) => ({ params: { meetupId: meetup._id.toString() } })),
    };
}

export async function getStaticProps(context) {
    const meetupId = context.params.meetupId;

    // fetch data for a single meetup

    const client = await MongoClient.connect(
        'mongodb+srv://nextjs:nextjs@cluster0.bmldpko.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupCollection = db.collection('meetups');

    const selectedMeetup = await meetupCollection.findOne({ _id: new ObjectId(meetupId) });

    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                description: selectedMeetup.description,
                image: selectedMeetup.image,
            },
        },
    };
}
export default MeetupDetails;
