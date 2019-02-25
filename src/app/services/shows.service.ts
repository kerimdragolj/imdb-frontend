import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { AppSettings } from '../app.settings';
import 'rxjs/add/operator/map';

@Injectable()
export class ShowsService {

    constructor(
        private http: Http
    ) { }

    getOne(id) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

        return this.http.get(AppSettings.API_ENDPOINT + '/shows/' + id, { headers: header }).map(res => res.json());
    }

    getAll(skip, limit) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');

        return this.http.get(AppSettings.API_ENDPOINT + '/shows?$sort[vote_average]=-1&$sort[id]=1&$skip=' + skip + '&$limit=' + limit, { headers: header }).map(res => res.json());
    }

    create(data) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

        return this.http.post(AppSettings.API_ENDPOINT + '/shows', data, { headers: header }).map(res => res.json());
    }

    edit(id, data) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

        return this.http.patch(AppSettings.API_ENDPOINT + '/shows/' + id, data, { headers: header }).map(res => res.json());
    }

    delete(id) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

        return this.http.get(AppSettings.API_ENDPOINT + '/shows/' + id, { headers: header }).map(res => res.json());
    }

    search(term, skip, limit) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');
        let params = new URLSearchParams('/shows?$sort[vote_average]=-1&$sort[id]=1&$skip=' + skip + '&$or[0][name][$iLike]=%' + term + '%&$or[1][original_name][$iLike]=%' + term + '%&$or[2][overview][$iLike]=%' + term + '%&$limit=' + limit);

        return this.http.get(AppSettings.API_ENDPOINT + params, { headers: header }).map(res => res.json());
    }





    // verbs searches
    getThreeStarShows(skip, limit) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');

        return this.http.get(AppSettings.API_ENDPOINT + '/shows?vote_average[$gte]=6&$sort[vote_average]=-1&$sort[id]=1&$skip=' + skip + '&$limit=' + limit, { headers: header }).map(res => res.json());
    }

    getFiveStarShows(skip, limit) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');

        return this.http.get(AppSettings.API_ENDPOINT + '/shows?vote_average[$gte]=9&$sort[vote_average]=-1&$sort[id]=1&$skip=' + skip + '&$limit=' + limit, { headers: header }).map(res => res.json());
    }

    getNewerShows(skip, limit) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');

        return this.http.get(AppSettings.API_ENDPOINT + '/shows?first_air_date[$gte]=2015&$sort[vote_average]=-1&$sort[id]=1&$skip=' + skip + '&$limit=' + limit, { headers: header }).map(res => res.json());
    }

    getOlderShows(skip, limit) {
        let header = new Headers();
        header.append('Content-Type', 'application/json');

        return this.http.get(AppSettings.API_ENDPOINT + '/shows?first_air_date[$lte]=2014&$sort[vote_average]=-1&$sort[id]=1&$skip=' + skip + '&$limit=' + limit, { headers: header }).map(res => res.json());
    }
}