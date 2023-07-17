const Libp2p = require('libp2p')
const Websockets = require('libp2p-websockets')
const { NOISE } = require('libp2p-noise')
const MPLEX = require('libp2p-mplex')
const Multiaddr = require('multiaddr')
const CID = require('cids')
const KadDHT = require('libp2p-kad-dht')

const defaultRendezvous = '/dns4/secure-beyond-12345.herokuapp.com/tcp/443/wss/p2p-webrtc-star/';
const defaultTopic = 'myspace';

const createNode = async (rendezvousString = defaultRendezvous, topic = defaultTopic) => {
    const node = await Libp2p.create({
        addresses: {
            listen: [
                '/ip4/0.0.0.0/tcp/0/ws',
            ],
        },
        modules: {
            transport: [Websockets],
            connEncryption: [NOISE],
            streamMuxer: [MPLEX],
            dht: KadDHT
        },
        config: {
            dht: {
                enabled: true
            }
        }
    });

    await node.start();
    console.log('Node started with peer id ', node.peerId.toB58String());

    node.connectionManager.on('peer:connect', (connection) => {
        console.log('Connected to ', connection.remotePeer.toB58String());
    });

    // Connect to the rendezvous server
    await node.dial(new Multiaddr(rendezvousString))

    await node.pubsub.subscribe(topic, (msg) => {
        console.log('Received message from ', msg.from, ': ', msg.data.toString());
    });

    console.log('Subscribed to topic ', topic);

    return node;
};

const publishChatMessage = async (node, topic, message) => {
    await node.pubsub.publish(topic, Buffer.from(message));
    console.log('Published message to topic ', topic, ': ', message);
};

module.exports = {
    createNode,
    publishChatMessage,
};
