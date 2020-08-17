export function invalidRequest(res) {
    res.status(400).send("Request Parameters Are Not Valid");
}

export function notFound(res) {
    res.status(404).send("Resource Not Found");
}
