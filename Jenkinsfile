pipeline {
   agent any

   tools {nodejs "NodeJS"}

   stages {
       stage('Downloading Dependencies') {
           steps {
               setBuildStatus("Build started", "PENDING");
               sh 'npm install'
           }
       }
       stage('Tests and Coverage') {
           steps {
               sh 'npm test'
           }
       }
   }
}