import { MongoClient } from 'mongodb';

// /api/new-meetup

async function handler(req, res) {
    if (req.method === 'POST') {
        const data = req.body;

        const client = await MongoClient.connect(
            'mongodb+srv://nextjs:nextjs@cluster0.bmldpko.mongodb.net/meetups?retryWrites=true&w=majority'
        );
        const db = client.db();

        const meetupCollection = db.collection('meetups');

        const result = await meetupCollection.insertOne(data);

        console.log(result);

        client.close();

        res.status(201).json({ message: 'Meetup inserted!' });
    }
}
export default handler;
