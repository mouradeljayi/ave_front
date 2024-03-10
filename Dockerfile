FROM ubuntu:22.04

RUN apt-get -y update && apt-get install -y lsb-release && apt-get clean all

RUN apt-get -y update

RUN apt-get -y install curl

RUN apt-get -y install wget

RUN apt-get -y install gnupg2

RUN curl -sL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | gpg --dearmor -o /usr/share/keyrings/nodesource.gpg

RUN echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] https://deb.nodesource.com/node_18.x $(lsb_release -cs) main" | tee /etc/apt/sources.list.d/nodesource.list

RUN apt-get -y update

RUN apt-get -y install nodejs

RUN apt-get -y install apache2

RUN apt-get -y install git

RUN apt-get -y install nano

RUN npm install -g @angular/cli

RUN mkdir /var/www/html/front

COPY . /var/www/html/front 

COPY ./000-default.conf /etc/apache2/sites-available/000-default.conf

RUN cd /var/www/html/front

WORKDIR /var/www/html/front

RUN npm install

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN a2enmod rewrite

RUN service apache2 restart

EXPOSE 80 4200 
 
CMD ["/bin/bash"]


# docker build -t footengineers-front:v1 .

# docker run -p 4200:4200 --name footengineers-front -v "C:\Users\Mourad El Jayi\Desktop\Foot_Engineers\footengineers_frontend":/var/www/html/front -dit footengineers-front:v1 bash

# docker run -p 8889:80 --name footengineers-front -dit footengineers-front:v1 bash

# ng serve --host 0.0.0.0

# docker run --name test -dit ubuntu:22.04 bash

# ng build && cp .htaccess dist/footengineers/