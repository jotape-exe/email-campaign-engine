export const EmailQueue = {
    exchange: "email",

    routingKey: "email.send",
    queue: "email.send.queue",

    delayRoutingKey: "email.send.delay",
    delayQueue: "email.send.delay.queue",

    dlqRoutingKey: "email.send.dlq",
    dlqQueue: "email.send.dlq.queue",
};