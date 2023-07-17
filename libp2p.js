const Libp2p = require('libp2p')
const Gossipsub = require('libp2p-gossipsub')
const WebSockets = require('libp2p-websockets')
const Multiplex = require('libp2p-mplex')
const { NOISE } = require('libp2p-noise')
const KadDHT = require('libp2p-kad-dht')
const multiaddr = require('multiaddr')

async function createLibp2pNode(topic, rendezvousString) {
    const node = await Libp2p.create({
        addresses: {
            listen: ['/ip4/0.0.0.0/tcp/0']
        },
        modules: {
            transport: [WebSockets],
            connEncryption: [NOISE],
            streamMuxer: [Multiplex],
            pubsub: Gossipsub,
            dht: KadDHT
        },
        config: {
            dht: {
                enabled: true,
                randomWalk: {
                    enabled: true
                }
            }
        }
    })

    await node.start()

    // Start DHT and use it for peer discovery
    const dht = KadDHT.createDHT(node)
    await dht.start()

    // Bootstrap with default bootstrap peers
    await Promise.all(KadDHT.defaultBootstrapPeers.map(async (peerAddr) => {
        const addr = multiaddr(peerAddr)
        const peerId = addr.getPeerId()
        const peerInfo = await node.peerStore.addressBook.set(peerId, [addr])
        await node.dial(peerInfo)
    }))

    // Advertise topic to the network
    await dht.put(Buffer.from(topic), node.peerId.toBytes())

    // Listen for peers who have announced the same topic
    const peerIdBytes = await dht.get(Buffer.from(topic))

    // Connect to the peers who have announced the same topic
    const peerId = PeerId.createFromBytes(peerIdBytes)
    const peerInfo = node.peerStore.get(peerId)
    await node.dial(peerInfo)

    console.log('Node started with peer id ', node.peerId.toB58String())

    return node
}

module.exports = createLibp2pNode
