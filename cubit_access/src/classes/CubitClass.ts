// TODO: import your own packages
import { NodeSSH } from 'node-ssh';
import fs from 'fs';
import os from 'os';

const ssh = new NodeSSH();

class CubitClass {

  address: string;
  username: string;
  password: string;

  constructor(address: string, username: string, password: string) {
    this.address = address;
    this.username = username;
    this.password = password;
  }

  async testConnection() {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    const result = await ssh.exec('ls', [], { cwd: '/', stream: 'stdout' });
 
    return result;
  }

  async makeTmpDir(base_dir: string) {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    const result = await ssh.exec(`mktemp -d --tmpdir=${base_dir}`, [], { cwd: '/', stream: 'stdout' });
    
    return result;
  }

  async cleanupTmpDir(tmpdir: string) {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    const result = await ssh.exec(`rm -rf ${tmpdir}`, [], { cwd: '/', stream: 'stdout' });
    
    return result;
  }

  async sendFile(local_file: string, remote_dir: string) {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    let result = await ssh.putFile(local_file!, remote_dir);

    return result;
  }

  async unzipFile(remote_dir: string, filename: string) {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    let result = await ssh.exec(`unzip ${filename}`, [], { cwd: remote_dir, stream: 'stdout' });

    return result;
  }

  async globalizeFileReference(remote_dir: string, filename: string, replace_string: string) {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    let result = await ssh.exec(`sed -i s#${replace_string}#${remote_dir}/${replace_string}#g ${filename}`, [], { cwd: remote_dir, stream: 'stdout' });

    return result;
  }

  async convertAbqsToExo(remote_dir: string, filename: string) {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    // write jou file
    await ssh.exec(`echo "undo on" >> convert.jou`, [], { cwd: remote_dir, stream: 'stdout' });
    await ssh.exec(`echo 'import abaqus \"${remote_dir}/${filename}\"' >> convert.jou`, [], { cwd: remote_dir, stream: 'stdout' });
    await ssh.exec(`echo "undo group begin" >> convert.jou`, [], { cwd: remote_dir, stream: 'stdout' });
    await ssh.exec(`echo "set exodus netcdf4 off" >> convert.jou`, [], { cwd: remote_dir, stream: 'stdout' });
    await ssh.exec(`echo "set large exodus file on" >> convert.jou`, [], { cwd: remote_dir, stream: 'stdout' });
    await ssh.exec(`echo 'export mesh \"${remote_dir}/mesh.e\" overwrite' >> convert.jou`, [], { cwd: remote_dir, stream: 'stdout' });
    await ssh.exec(`echo "undo group end" >> convert.jou`, [], { cwd: remote_dir, stream: 'stdout' });

    // execute Cubit mesh gen
    await ssh.exec(`echo "module load use.restricted Cubit" >> cubit.bash`, [], { cwd: remote_dir, stream: 'stdout' });
    await ssh.exec(`echo "cubit -batch -nographics -nojournal convert.jou" >> cubit.bash`, [], { cwd: remote_dir, stream: 'stdout' });
    let result = await ssh.exec("bash cubit.bash", [], { cwd: remote_dir, stream: 'stdout' });

    return result;
  }

  async sculptExo(remote_dir: string, filename: string) {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    // execute Cubit sculpt
    await ssh.exec(`echo "module load use.restricted Cubit" >> sculpt.bash`, [], { cwd: remote_dir, stream: 'stdout' });
    await ssh.exec(`echo "sculpt --input_cart_exo ${filename}" >> sculpt.bash`, [], { cwd: remote_dir, stream: 'stdout' });
    let result: any = {};
    try {
      result = await ssh.exec("bash sculpt.bash", [], { cwd: remote_dir, stream: 'stdout' });
    } catch(err) {
      console.log(err);
    }

    return result;
  }

  async checkSculpt(remote_dir: string, filename: string) {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    // check for sculpted file
    let count_output = await ssh.exec(`find . -maxdepth 1 -name "${filename}" -exec stat -f "." {} \\; | wc -l`, [], { cwd: remote_dir, stream: 'stdout' });

    return count_output;
  }

  async getSculptedExo(remote_dir: string, filename: string, remote_filename: string) {
    await ssh.connect({
      host: this.address,
      username: this.username,
      password: this.password
    });

    let tmpdir = fs.mkdtempSync(os.tmpdir());

    await ssh.getFile(tmpdir + "/" + filename, remote_dir + "/" + remote_filename);

    return tmpdir;
  }
}

export { CubitClass }
