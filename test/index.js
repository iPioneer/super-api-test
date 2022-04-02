import supertest from 'supertest'
import {expect} from 'chai'
import Ajv from 'ajv'

const request = supertest('https://l761dniu80.execute-api.us-east-2.amazonaws.com/default/exercise_api');
const ajv = new Ajv({allErrors: true});


const schema = {
    type: "object",
    properties: {
        value: {type: "string"},
        main_key: {type: "string"}
    }
}
const validate = ajv.compile(schema)


describe('Test GET api method', () => {
    it('Get array of objects and validate schema', () => {
        return request
            .get('/')
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.empty;
                expect(res.body).to.have.length.lessThanOrEqual(11);
                res.body.forEach((data) => {
                    const valid = validate(data);
                    if (!valid) console.log(validate.errors);
                    console.log(`{value: ${data.value}, main_key: ${data.main_key}}`);
                });
            });
    });
});

describe('Test PUT api method', () => {
    let requestBody = {"value": `${Math.floor(Math.random() * 999)}`, "main_key": `ursa5${Math.floor(Math.random() * 9999)}`};

    before(() => {
        return request
            .get('/')
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.empty;
                expect(res.body).to.have.length.greaterThan(0);
                if (res.body.length > 10) {
                    let keyToDelete = res.body[0].main_key;
                    return request
                        .delete("/")
                        .set('Content-type', 'application/json')
                        .set('Content', 'JSON object')
                        .send(`{"main_key": "${keyToDelete}"}`)
                        .then((res) => {
                            expect(res.body).to.not.be.empty;
                        })
                }
            });

    });

    it('Create new item', () => {
        return request
            .put("/")
            .set('Content-type', 'application/json')
            .set('Content', 'JSON object')
            .send(requestBody)
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.empty;
                expect(res.body.value).to.be.equal(requestBody.value);
                expect(res.body.main_key).to.be.equal(requestBody.main_key);
                console.log(`PUT {value: ${requestBody.value}, main_key: ${requestBody.main_key}}`);
            })
    });
});

describe('Test DELETE api method', () => {
    it('Delete item', () => {
        return request
            .get('/')
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.empty;
                expect(res.body).to.have.length.greaterThan(0);
                let keyToDelete = res.body[0].main_key;
                return request
                    .delete("/")
                    .set('Content-type', 'application/json')
                    .set('Content', 'JSON object')
                    .send(`{"main_key": "${keyToDelete}"}`)
                    .then((res) => {
                        expect(res.body).to.not.be.empty;
                        expect(res.body.main_key).to.be.equal(keyToDelete);
                        console.log(`DELETE {main_key: ${keyToDelete}}`);
                    })
            });
    });
});


describe('Test POST api method', () => {
    let keyToUpdate = '';
    let valueToUpdate = '';

    before(() => {
        return request
            .get('/')
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.empty;
                expect(res.body).to.have.length.greaterThan(0);
                keyToUpdate = res.body[0].main_key;
                valueToUpdate = `${res.body[0].value}7`;
            });
    });

    it('Update existing item', () => {
        return request
            .post("/")
            .set('Content-type', 'application/json')
            .set('Content', 'JSON object')
            .send(`{"value": "${valueToUpdate}", "main_key": "${keyToUpdate}"}`)
            .expect(200)
            .then((res) => {
                expect(res.body).to.not.be.empty;
                expect(res.body.value).to.be.equal(valueToUpdate);
                expect(res.body.main_key).to.be.equal(keyToUpdate);
                console.log(`POST {"value": "${valueToUpdate}", "main_key": "${keyToUpdate}"}`);
            })
    });
});