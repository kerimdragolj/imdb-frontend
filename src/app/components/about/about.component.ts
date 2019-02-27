import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MoviesService } from '../../services/movies.service';
import { ShowsService } from '../../services/shows.service';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  tab: string;
  id: number;
  data;
  user;

  constructor(
    private router: RouterModule,
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private showsService: ShowsService,
    private ratingService: RatingService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.tab = this.route.snapshot.data['tab'];
      
      if (this.tab == 'movies') this.getMovie(this.id);
      else this.getShow(this.id);
    });
    let user = localStorage.getItem('user');
    if (user) this.user = JSON.parse(user);
  }

  getMovie(id) {
    this.moviesService.getOne(id).subscribe(res => {
      this.appendUsersRatingToLoadedData(res);
    }, err => {
      console.error(err);
    })
  }

  getShow(id) {
    this.showsService.getOne(id).subscribe(res => {
      this.appendUsersRatingToLoadedData(res);
    }, err => {
      console.error(err);
    })
  }

  appendUsersRatingToLoadedData(res) {
    let title = '';
    let userRating = { rating: 0 }
    if (this.tab == 'movies') title = res.title;
    else title = res.name;

    if (this.user) {
      res.ratings.forEach(el => {
        if (el.userId == this.user.id) {
          userRating = el;
          return;
        }
      });
    }

    this.data = {
      id: res.id,
      title: title,
      poster: res.poster_path,
      genres: res.genres,
      actors: res.actors,
      overview: res.overview,
      rating: res.vote_average,
      userRating: userRating.rating,
      userRatingObject: userRating
    }
  }

  submitRating(value) {
    if (this.user) {
      this.data.userRating = value;
      if (this.data.userRatingObject.rating !== 0) {
        this.ratingService.edit(this.data.userRatingObject.id, {
          movieId: this.data.userRatingObject.movieId,
          showId: this.data.userRatingObject.showId,
          rating: value,
          prevRating: this.data.userRatingObject.rating
        }).subscribe(res => {
          this.data.userRatingObject = res;
        }, err => { console.error(err) })
      } else {
        this.ratingService.create(value, this.user.id, this.data.id, this.tab).subscribe(res => {
          this.data.userRatingObject = res;
        }, err => {
          console.error(err);
        })
      }
    }
  }

}
