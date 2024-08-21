FROM unlhcc/dream3d

RUN apt-get update && apt-get upgrade -y

RUN apt-get install -y wget build-essential checkinstall  libreadline-gplv2-dev  libncursesw5-dev  libssl-dev  libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev && \
    cd /usr/src && \
    wget --no-check-certificate https://www.python.org/ftp/python/3.8.10/Python-3.8.10.tgz && \
    tar xzf Python-3.8.10.tgz && \
    cd Python-3.8.10 && \
    ./configure --enable-optimizations && \
    make altinstall

RUN apt-get update && apt-get install -y ca-certificates wget python3-pip
RUN cd /etc/ssl/certs/ && \
    wget -O inlcaroot.crt http://certstore.inl.gov/pki/CAINLROOT_B64.crt && \
    update-ca-certificates && \
    wget -O inlcaint.crt http://certstore.inl.gov/pki/CAINLINT_B64.crt && \
    update-ca-certificates

RUN pip3 install --upgrade pip

COPY ./requirements.txt /home/py/webserver/requirements.txt
WORKDIR /home/py/webserver
RUN /usr/local/bin/python3.8 -m pip --trusted-host pypi.python.org --trusted-host files.pythonhosted.org --trusted-host pypi.org install -r requirements.txt
COPY ./src/main.py /home/py/webserver/main.py

# ENTRYPOINT ["tail", "-f", "/dev/null"]
