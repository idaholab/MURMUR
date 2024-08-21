// TODO: add your own packages.
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import os from 'os';
import multer from 'multer';

const upload = multer({dest: os.tmpdir()})

import { IProcessEnv } from './interfaces/IProcessEnv';

import { CubitClass } from './classes/CubitClass';

dotenv.config();

let env_vars: IProcessEnv = process.env;

const port: number = parseInt(env_vars.CUBIT_PORT!);

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', function(req, res) {
  res.status(200).send({ 'message': "This is the Cubit access microservice" });
});

// this is the standard format for an adapter health response
app.get('/health', async function(req, res) {
  try {
    res.status(200).send([{
      "value": "OK"
    }]);
  } catch(err) {
    console.log("HEALTH");
    console.log(err);
    res.status(500).send({
      'message': "Health endpoint inaccessible"
    });
  }
});

app.get('/test', async function(req, res) {
  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    await cubit.testConnection();
    res.status(200).write("OK");
    res.end();
  } catch(err) {
    console.log("TEST");
    console.log(err);
    res.status(500).send({
      'message': "Test failed"
    });
  }
});

app.get('/make_tmpdir', async function(req, res) {
  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    let response = await cubit.makeTmpDir(env_vars.WORKING_DIR!);
    res.status(200).write(response);
    res.end();
  } catch(err) {
    console.log("MAKE TMP DIR");
    console.log(err);
    res.status(500).send({
      'message': "Temporary directory write failed"
    });
  }
});

app.post('/cleanup_tmpdir', async function(req, res) {

  const remote_dir = req.body.remote_dir;

  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    let response = await cubit.cleanupTmpDir(remote_dir);
    res.status(200).write(response);
    res.end();
  } catch(err) {
    console.log("CLEANUP TMP DIR");
    console.log(err);
    res.status(500).send({
      'message': "Temporary directory cleanup failed"
    });
  }
});

app.post('/post_file', upload.single('file'), async function(req, res) {

  const local_file = req.file;
  const remote_dir = req.body.remote_dir;

  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    await cubit.sendFile(local_file?.path!, `${remote_dir}/${local_file?.originalname!}`);
    res.status(200).write(local_file?.originalname!);
    res.end();
  } catch(err) {
    console.log("POST FILE");
    console.log(err);
    res.status(500).send({
      'message': "File post failed"
    });
  }
});

app.post('/unzip_file', async function(req, res) {

  const remote_dir = req.body.remote_dir;
  const filename = req.body.filename;

  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    await cubit.unzipFile(remote_dir, filename);
    res.status(200).write(`${filename} unzipped at ${remote_dir}`);
    res.end();
  } catch(err) {
    console.log("UNZIP FILE");
    console.log(err);
    res.status(500).send({
      'message': "File post failed"
    });
  }
});

app.post('/globalize_file_reference', async function(req, res) {

  const remote_dir = req.body.remote_dir;
  const filename = req.body.filename;
  const replace_string = req.body.replace_string;

  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    await cubit.globalizeFileReference(remote_dir, filename, replace_string);
    res.status(200).write(`${filename} unzipped at ${remote_dir}`);
    res.end();
  } catch(err) {
    console.log("GLOBAL FILE REFERENCE");
    console.log(err);
    res.status(500).send({
      'message': "File post failed"
    });
  }
});

app.post('/convert_abqs_to_exo', async function(req, res) {

  const remote_dir = req.body.remote_dir;
  const filename = req.body.filename;

  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    await cubit.convertAbqsToExo(remote_dir, filename);
    res.status(200).write(`${filename} exported as .exo at ${remote_dir}`);
    res.end();
  } catch(err) {
    console.log("CONVERT ABQS TO EXO");
    console.log(err);
    res.status(500).send({
      'message': "File conversion failed"
    });
  }
});

app.post('/sculpt_exo', async function(req, res) {

  const remote_dir = req.body.remote_dir;
  const filename = req.body.filename;

  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    await cubit.sculptExo(remote_dir, filename);
    res.status(200).write(`Exodus file ${filename} sculpted at ${remote_dir}`);
    res.end();
  } catch(err) {
    console.log("SCULPT EXO");
    console.log(err);
    res.status(500).send({
      'message': "File conversion failed"
    });
  }
});

app.post('/check_sculpt', async function(req, res) {

  const remote_dir = req.body.remote_dir;
  const filename = req.body.filename;

  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    let count = await cubit.checkSculpt(remote_dir, filename);
    res.status(200).write(count);
    res.end();
  } catch(err) {
    console.log("CHECK SCULPT");
    console.log(err);
    res.status(500).send({
      'message': "File creation failed"
    });
  }
});

app.post('/get_sculpted_exo', async function(req, res) {

  const remote_dir = req.body.remote_dir;
  const filename = req.body.filename;
  const remote_filename = req.body.filename;

  const cubit = new CubitClass(
    env_vars.HPC_HOST!,
    env_vars.HPC_USER!,
    env_vars.HPC_PASSWORD!
  );

  try {
    let tmpdir = await cubit.getSculptedExo(remote_dir, filename, remote_filename);

    res.sendFile(tmpdir + "/" + filename);

    // res.status(200).write(tmpdir);
    // res.end();
  } catch(err) {
    console.log("GET SCULPTED EXO");
    console.log(err);
    res.status(500).send({
      'message': "File conversion failed"
    });
  }
});

app.listen(port, () => {
  console.log(`Cubit microservice running on port ${port}`);
});
