import Head from 'next/head';

import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList';
import { Fragment } from 'react';

function HomePage(props) {
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content="Browse a huge list of highly active React meetups!" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
}

// 빌드 프로세스 중에 실행 X ,
// 요청이 들어올 때마다 실행
// export async function getServerSideProps(context) {
//     const req = context.req;
//     const res = context.res;

//     //fetch data from an API
//     return {
//         props: DUMMY_MEETUPS,
//     };
// }

// 인증 같은것이 필요 없을 때,
export async function getStaticProps() {
    //fetch data from an API

    const client = await MongoClient.connect(
        'mongodb+srv://nextjs:nextjs@cluster0.bmldpko.mongodb.net/meetups?retryWrites=true&w=majority'
    );
    const db = client.db();

    const meetupCollection = db.collection('meetups');

    const meetups = await meetupCollection.find().toArray();

    client.close();

    return {
        props: {
            meetups: meetups.map((meetup) => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString(),
            })),
        },
        revalidate: 10, // 이 페이지에 요청이 들어오면 적어도 10초마다 서버에서 페이지를 다시 생성
    };
}

export default HomePage;
