const gulp = require('gulp');
const clean = require('gulp-clean');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

// task 1 - scripts
gulp.task('scripts', ['static'], () => {
   
    const tsResult = tsProject.src()
                        .pipe(tsProject());

    return tsResult.js
            .pipe(gulp.dest('dist'));   // gera o javascript e envia para nosso diretório destino 'dist'.

});

// task 2 - static (copia todos os arquivos .json de 'src' para 'dist').
gulp.task('static', ['clean'], () => {
    return gulp
        .src(['src/**/*.json'])
        .pipe(gulp.dest('dist'));
});

// task 3 - clean (responsavel por limpar nosso diretório 'dist');
gulp.task('clean', () => {
    return gulp
        .src('dist')
        .pipe(clean());
});

// task 4 - build (chama as outras tareafs que temos em ordem)
gulp.task('build', ['scripts']);

// Tarefa que ficará verificado as alterações nos códigos
gulp.task('watch', ['build'], () => {
    return gulp.watch(['src/**/*.ts', 'src/**/*.json'], ['build']); // sempre que houver alteração em algum desses cara executar a tarefa 'build'.
});

// Task 'default', assim não precisamos mas passar o nome da tarefa quando executarmos o comando
// via terminal
gulp.task('default', ['watch']);