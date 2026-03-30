export const EmailQueue = {
    exchange: "email",

    routingKey: "email.send",
    queue: "email.send.queue",

    dlqRoutingKey: "email.send.dlq",
    dlqQueue: "email.send.dlq.queue",
};