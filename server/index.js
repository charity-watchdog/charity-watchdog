const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const morgan = require('morgan');
const { Pool } = require('pg');
const { execSync } = require('child_process');
const Meerkat = require('./meerkat');
const bodyParser = require('body-parser');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;
const databaseUrl = process.env.DATABASE_URL || new String(execSync('heroku config:get DATABASE_URL -a charity-watchdog')).trim();

const pool = new Pool({ connectionString: databaseUrl, ssl: true, statement_timeout: 25000 });

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });

} else {
    const app = express();

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    // Attach a logging middleware
    app.use(morgan('tiny'));

    // Priority serve any static files.
    app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

    // Answer API requests.
    app.get('/api', function (req, res) {
        res.set('Content-Type', 'application/json');
        res.send('{"message":"Coming Soon"}');
    });

    app.get('/api/v1/charity', (req, res) => {
        res.set('Content-Type', 'application/json');

        pool.query(
            'SELECT id, name, description, wallet_address, missing_proof, logo_url FROM charities',
            (err, queryRes) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ error: err });
                } else {
                    res.send({ data: queryRes.rows });
                }
            }
        );
    });

    app.get('/api/v1/charity/:charityID', (req, res) => {
        res.set('Content-Type', 'application/json');

        pool.query(
            'SELECT id, to_address, timestamp, description, eth_value, proof FROM transactions WHERE charity_id = $1',
            [ req.params.charityID ],
            (err, queryRes) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ error: err });
                } else {
                    res.send({ data: queryRes.rows });
                }
            }
        );
    });

    app.post('/api/v1/charity/new', (req, res) => {
        res.set('Content-Type', 'application/json');
        const { name, description, walletAddress } = req.body;

        Meerkat
            .createAddressSubscription(walletAddress)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.status);
                }

                console.log(`Meerkat.createAddressSubscription response body: ${response.body}`)
                const meerkatSubID = response.body;

                pool.query(
                    `INSERT INTO charities
                        (name, description, wallet_address, meerkat_subscription_id)
                        VALUES
                        ($1, $2, $3, $4)
                        RETURNING id`,
                    [name, description, walletAddress, meerkatSubID],
                    (err, queryRes) => {
                        if (err) {
                            res.status(500).send({ error: err });
                        } else {
                            res.send({ data: queryRes.rows[0].id });
                        }
                    }
                );
            })
        ;
    });

    app.get('/webhook/v1/address', (req, res) => {

        console.log(req.body);
        res.status(200).end();

        if (req.body.event !== 'mined' || req.body.type !== 'sent') {
            return
        }

        pool.query(
            'UPDATE charities SET missing_proof = true WHERE wallet_address = $1 RETURNING id',
            [ req.body.address ],
            (err, queryRes) => {
                if (err) {
                    console.error(err);
                    return
                }

                const charityID = queryRes.rows[0].id;

                pool.query(
                    `INSERT INTO transactions
                        (charity_id, to_address, timestamp, eth_value)
                        VALUES
                        ($1, $2, $3, $4)`,
                    [ charityID, req.body.outputs[0], req.body.timestamp, req.body.amount ],
                    (err, queryRes) => {
                        if (err) {
                            console.error(err);
                        }
                    }
                );
            }
        );

    });

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function(request, response) {
        response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
    });

    app.listen(PORT, function () {
        console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
    });
}
