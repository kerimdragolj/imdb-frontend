import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MoviesService } from '../../services/movies.service';
import { ShowsService } from '../../services/shows.service';
import { RatingsService } from '../../services/ratings.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currTab = 'movies';
  currLayout = 'grid';
  isSearching = false;
  oldValue = 5;
  term = '';
  value = 5;
  data = [];
  limit = 10;
  total = 0;

  constructor(
    private usersService: UsersService,
    private moviesService: MoviesService,
    private showsService: ShowsService,
    private ratingsService: RatingsService,
    private toast: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData();
  }

  submitRating(i, value) {
    if (this.usersService.isLoggedIn()) { //If logged in
      if (this.data[i].prevUserRating > 0) {
        this.editRating(this.data[i].id, value, this.data[i].prevUserRating);
      } else {
        let user = JSON.parse(localStorage.getItem('user'));
        if (this.currTab == 'movies') {
          this.ratingsService.rateMovie(value, user.id, this.data[i].id).subscribe(res => {
            this.usersService.storeData(localStorage.getItem('feathers-jwt'));
          }, err => { console.log(err) })
        } else {
          this.ratingsService.rateShow(value, user.id, this.data[i].id).subscribe(res => {
            this.usersService.storeData(localStorage.getItem('feathers-jwt'));
          }, err => { console.log(err) })
        }
      }
      this.data[i].prevUserRating = value;
    } else {//if not logged in
      if (window.confirm('You have to sing in to give review.. Do you want to?')) {
        this.router.navigate(['/login']);
      } else {
        return false;
      }
    }
  }

  loadMovies(skip, limit) {
    this.moviesService.getAll(skip, limit).subscribe(res => {
      this.pushNewData(res);
      this.appendUserRatings(this.data);
      this.total = res.total;
    }, err => {
      this.toast.error('Loading movies', 'UNSUCCESSFUL');
      console.error(err);
    })
  }

  searchMovies(term, skip, limit) {
    this.moviesService.search(term, skip, limit).subscribe(res => {
      this.pushNewData(res);
      this.appendUserRatings(this.data);
      this.total = res.total;
    }, err => {
      this.toast.error('Searching movies', 'UNSUCCESSFUL');
      console.error(err);
    })
  }

  loadShows(skip, limit) {
    this.showsService.getAll(skip, limit).subscribe(res => {
      this.pushNewData(res);
      this.appendUserRatings(this.data);
      this.total = res.total;
    }, err => {
      this.toast.error('Loading shows', 'UNSUCCESSFUL');
      console.error(err);
    })
  }

  searchShows(term, skip, limit) {
    this.showsService.search(term, skip, limit).subscribe(res => {
      this.pushNewData(res);
      this.appendUserRatings(this.data);
    }, err => {
      this.toast.error('Searching shows', 'UNSUCCESSFUL');
      console.error(err);
    })
  }

  loadData() {
    this.isSearching = false;
    if (this.currTab == 'movies') {
      this.loadMovies(this.data.length, this.limit);
    } else {
      this.loadShows(this.data.length, this.limit);
    }
  }



  /*  - Above the Toggle/Tab component, there should be a search bar that would allow user to search for any movie/show in the DB
      - Search bar should react to user's input automatically, but not before there's at least 2 characters entered in the search bar
      - Search should be by any of the movie's textual attributes
      - Search engine should also understand phrases like "5 stars", "at least 3 stars", "after 2015", "older than 5 years"
      - Search results should still be sorted by movie rating, just as they are upon the app start (so the page always displays either top 10 rated movies of all time, or top 10 rated movies among all the search results)
      - If the search bar is cleared, top 10 movies/shows of all time should re-appear as results, depending on which tab/toggle switch value is selected
  */
  // Since range we got here is 1-10 ---->>>> "5 stars" = rating > 9 ;     "at least 3 stars" = rating > 6 ;

  searchData() {
    if (this.term.length >= 2) {
      if (this.currTab == 'movies') {
        switch (this.term.toLowerCase().trim()) {
          case 'at least 3 stars': {
            this.moviesService.getThreeStarMovies(this.data.length, this.limit).subscribe(res => {
              this.pushNewData(res);
            }, err => { console.log(err); });
            break;
          }
          case '5 stars': {
            this.moviesService.getFiveStarMovies(this.data.length, this.limit).subscribe(res => {
              this.pushNewData(res);
            }, err => { console.log(err); });
            break;
          }
          case 'after 2015': {
            this.moviesService.getNewerMovies(this.data.length, this.limit).subscribe(res => {
              this.pushNewData(res);
            }, err => { console.log(err); });
            break;
          }
          case 'older than 5 years': {
            this.moviesService.getOlderMovies(this.data.length, this.limit).subscribe(res => {
              this.pushNewData(res);
            }, err => { console.log(err); });
            break;
          }
          default: {
            this.searchMovies(this.term, this.data.length, this.limit);
            break;
          }
        }
      } else {
        switch (this.term.toLowerCase().trim()) {
          case 'at least 3 stars': {
            this.showsService.getThreeStarShows(this.data.length, this.limit).subscribe(res => {
              this.pushNewData(res);
            }, err => { console.log(err); });
            break;
          }
          case '5 stars': {
            this.showsService.getFiveStarShows(this.data.length, this.limit).subscribe(res => {
              this.pushNewData(res);
            }, err => { console.log(err); });
            break;
          }
          case 'after 2015': {
            this.showsService.getNewerShows(this.data.length, this.limit).subscribe(res => {
              this.pushNewData(res);
            }, err => { console.log(err); });
            break;
          }
          case 'older than 5 years': {
            this.showsService.getOlderShows(this.data.length, this.limit).subscribe(res => {
              this.pushNewData(res);
            }, err => { console.log(err); });
            break;
          }
          default: {
            this.searchShows(this.term, this.data.length, this.limit);
            break;
          }
        }
      }
    }
  }

  searchChanged() {
    this.term = this.term.trim();
    if (this.term.length >= 2) {
      this.data = [];
      this.searchData();
    } else if (this.term == '') {
      this.data = [];
      this.loadData();
    }
  }

  loadMore() {
    if (this.term.trim().length > 0) {
      this.searchData();
    } else {
      this.loadData();
    }
  }

  appendUserRatings(data) {
    let user = localStorage.getItem('user');
    if (user) {
      let userRatings = JSON.parse(user).ratings;
      for (let i = 0; i < userRatings.length; i++) {
        for (let j = 0; j < data.length; j++) {
          if (this.currTab == 'movies') {
            if (userRatings[i].movieId == data[j].id) {
              data[j].userRating = userRatings[i].rating;
              data[j].prevUserRating = userRatings[i].rating;
            }
          } else {
            if (userRatings[i].showId == data[j].id) {
              data[j].userRating = userRatings[i].rating;
              data[j].prevUserRating = userRatings[i].rating;
            }
          }
        }
      }
    }
  }

  editRating(id, value, oldValue) {
    let usersRatings = JSON.parse(localStorage.getItem('user')).ratings;
    for (let i = 0; i < usersRatings.length; i++) {
      if (this.currTab == 'movies') {
        if (usersRatings[i].movieId == id) {
          this.ratingsService.edit(usersRatings[i].id, {
            movieId: id,
            rating: value,
            prevRating: oldValue
          }).subscribe(res => {
            this.usersService.storeData(localStorage.getItem('feathers-jwt'));
          }, err => { console.log(err) });
        }
      } else {
        if (usersRatings[i].showId == id) {
          this.ratingsService.edit(usersRatings[i].id, {
            showId: id,
            rating: value,
            prevRating: oldValue
          }).subscribe(res => {
            this.usersService.storeData(localStorage.getItem('feathers-jwt'));
          }, err => { console.log(err) });
        }
      }
    }
  }

  pushNewData(res) {
    this.total = res.total;
    res.data.forEach(el => {
      this.data.push({
        id: el.id,
        title: el.title,
        poster: el.poster_path,
        overview: el.overview,
        rating: el.vote_average,
        votes: el.vote_count,
        userRating: 0,
        prevUserRating: 0
      });
    });
  }
}
