FROM ubuntu:vivid

MAINTAINER Z Lab Corporation "opensource@sweplox.net"

RUN apt-get update \
 && apt-get -y install nodejs npm git \
 && apt-get clean

RUN update-alternatives --install /usr/bin/node node /usr/bin/nodejs 12

# Add group
ENV EXAMPLE_GROUP example
RUN groupadd -r $EXAMPLE_GROUP

# Add user
ENV EXAMPLE_USER example
ENV EXAMPLE_UID 3000
RUN useradd -r -u $EXAMPLE_UID -g $EXAMPLE_GROUP $EXAMPLE_USER

# Build application
RUN mkdir /opt/ttechat
WORKDIR /opt
RUN git clone -b 0.1.0 https://github.com/Tooxic/ttechat.git
WORKDIR /opt/ttechat
RUN npm install

EXPOSE 4000
EXPOSE 3000
USER $EXAMPLE_USER

ENV PORT=3000
ENV PORTSOCKET=4000
CMD [ "npm", "start"]