import * as amqp from "amqplib";
import { Channel, ChannelModel } from "amqplib";

class RabbitMQConnection {
    private static instance: RabbitMQConnection;
    private connection!: ChannelModel;
    private channel!: Channel;

    private constructor() { }

    static async getInstance() {
        if (!this.instance) {
            this.instance = new RabbitMQConnection();
            await this.instance.connect();
        }
        return this.instance;
    }

    private async connect() {
        this.connection = await amqp.connect("amqp://localhost");
        this.channel = await this.connection.createChannel();
    }

    getChannel() {
        return this.channel;
    }
}

export { RabbitMQConnection };
