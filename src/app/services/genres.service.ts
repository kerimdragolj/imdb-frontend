import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../app.settings';
import 'rxjs/add/operator/map';

@Injectable()
export class GenresService {

    constructor(
        private http: Http
    ) { }

    getOne(id) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

        return this.http.get(AppSettings.API_ENDPOINT + '/genres/' + id, { headers: header }).map(res => res.json());
    }

    getAll(skip, limit) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');

        return this.http.get(AppSettings.API_ENDPOINT + '/genres?$skip=' + skip + '&$limit=' + limit, { headers: header }).map(res => res.json());
    }

    create(data) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

        return this.http.post(AppSettings.API_ENDPOINT + '/genres', data, { headers: header }).map(res => res.json());
    }

    edit(id, data) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

        return this.http.patch(AppSettings.API_ENDPOINT + '/genres/' + id, data, { headers: header }).map(res => res.json());
    }

    delete(id) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

        return this.http.get(AppSettings.API_ENDPOINT + '/genres/' + id, { headers: header }).map(res => res.json());
    }
}