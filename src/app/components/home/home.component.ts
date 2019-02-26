import { Component, OnInit, TemplateRef } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MoviesService } from '../../services/movies.service';
import { ShowsService } from '../../services/shows.service';
import { RatingsService } from '../../services/ratings.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

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
  limit = 12;
  total = 0;
  user;
  modalRef: BsModalRef;

  constructor(
    private usersService: UsersService,
    private moviesService: MoviesService,
    private showsService: ShowsService,
    private ratingsService: RatingsService,
    private toast: ToastrService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.loadData();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Function used to firstly check if user can rate, then after determine if user has already
   * rated that movie/show and lastly submiting rate and refreshing data
   * @param i ordinal number of movie/show we wish to rate
   * @param value rating we wish to give
   * @param template 
   */
  submitRating(i: number, value: number, template: TemplateRef<any>) {
    if (this.usersService.isLoggedIn()) {
      if (this.data[i].userRatingObject.rating !== 0) { //user rated this one previously
        this.editRating(i, value);
      } else { //user is rating this one for the first time
        this.data[i].userRating = value;
        if (this.currTab == 'movies') {
          this.ratingsService.rateMovie(value, this.user.id, this.data[i].id).subscribe(res => {
            this.usersService.storeData(localStorage.getItem('feathers-jwt'));
            this.data[i].userRatingObject = res;
          }, err => { console.log(err) })
        } else {
          this.ratingsService.rateShow(value, this.user.id, this.data[i].id).subscribe(res => {
            this.usersService.storeData(localStorage.getItem('feathers-jwt'));
            this.data[i].userRatingObject = res;
          }, err => { console.log(err) })
        }
      }
    } else {
      this.openModal(template);
    }
  }

  /**
   * Function used to edit ratings on movies/shows that we previously rated
   * @param i is ordinal number of loaded movie/show objects which we rated
   * @param value is value of our rating
   */
  editRating(i: number, value: number) {
    let movieShow = this.data[i];
    this.ratingsService.edit(movieShow.userRatingObject.id, {
      movieId: movieShow.userRatingObject.movieId,
      showId: movieShow.userRatingObject.showId,
      rating: value,
      prevRating: movieShow.userRatingObject.rating
    }).subscribe(res => {
      this.data[i].userRating = res.rating;
      this.data[i].userRatingObject = res;
      this.usersService.storeData(localStorage.getItem('feathers-jwt'));
    }, err => { console.log(err) });
  }


  /**
   * Functions used to load movies and shows
   * @param skip amount of objects we wanna skip, in case its not first chunk
   * @param limit amount of objects we load in each request
   */
  loadMovies(skip: number, limit: number) {
    this.moviesService.getAll(skip, limit).subscribe(res => {
      this.pushNewDataIntoArray(res);
      this.total = res.total;
    }, err => {
      this.toast.error('Loading movies', 'UNSUCCESSFUL');
      console.error(err);
    })
  }
  loadShows(skip: number, limit: number) {
    this.showsService.getAll(skip, limit).subscribe(res => {
      this.pushNewDataIntoArray(res);
      this.total = res.total;
    }, err => {
      this.toast.error('Loading shows', 'UNSUCCESSFUL');
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


  /**
   * Function that detects changes in search input
   */
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

  /**
   * Function used to check what user is searching for and determine which request to make
   */
  searchData() {
    if (this.currTab == 'movies') {
      switch (this.term.toLowerCase().trim()) {
        case 'at least 3 stars': {
          this.moviesService.getThreeStarMovies(this.data.length, this.limit).subscribe(res => {
            this.pushNewDataIntoArray(res);
          }, err => { console.log(err); });
          break;
        }
        case '5 stars': {
          this.moviesService.getFiveStarMovies(this.data.length, this.limit).subscribe(res => {
            this.pushNewDataIntoArray(res);
          }, err => { console.log(err); });
          break;
        }
        case 'after 2015': {
          this.moviesService.getNewerMovies(this.data.length, this.limit).subscribe(res => {
            this.pushNewDataIntoArray(res);
          }, err => { console.log(err); });
          break;
        }
        case 'older than 5 years': {
          this.moviesService.getOlderMovies(this.data.length, this.limit).subscribe(res => {
            this.pushNewDataIntoArray(res);
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
            this.pushNewDataIntoArray(res);
          }, err => { console.log(err); });
          break;
        }
        case '5 stars': {
          this.showsService.getFiveStarShows(this.data.length, this.limit).subscribe(res => {
            this.pushNewDataIntoArray(res);
          }, err => { console.log(err); });
          break;
        }
        case 'after 2015': {
          this.showsService.getNewerShows(this.data.length, this.limit).subscribe(res => {
            this.pushNewDataIntoArray(res);
          }, err => { console.log(err); });
          break;
        }
        case 'older than 5 years': {
          this.showsService.getOlderShows(this.data.length, this.limit).subscribe(res => {
            this.pushNewDataIntoArray(res);
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

  /**
   * Functions used to Search data
   * @param term is our input in search 
   * @param skip amout of data that we wanna skip, in case it isn't first chunk of data (load more)
   * @param limit amount of data we wanna load in each request
   */
  searchMovies(term: string, skip: number, limit: number) {
    this.moviesService.search(term, skip, limit).subscribe(res => {
      this.pushNewDataIntoArray(res);
      this.total = res.total;
    }, err => {
      this.toast.error('Searching movies', 'UNSUCCESSFUL');
      console.error(err);
    })
  }
  searchShows(term: string, skip: number, limit: number) {
    this.showsService.search(term, skip, limit).subscribe(res => {
      this.pushNewDataIntoArray(res);
    }, err => {
      this.toast.error('Searching shows', 'UNSUCCESSFUL');
      console.error(err);
    })
  }


  /**
   * Function used to load more data, either more of searched/filtered data or not
   */
  loadMore() {
    if (this.term.trim().length > 0) {
      this.searchData();
    } else {
      this.loadData();
    }
  }

  /**
   *  Function used to check if user already rated movie/show and populate their
   *  objects with value of users rate. We need that so we can display users rating
   *  and to differentiate between new ratings and editing old ones so we don't make
   *  more than one rating for one movie/show by same user.
   *  @param res is data in response that we get from API through service
   */
  pushNewDataIntoArray(res) {
    this.total = res.total;
    let title = '';
    res.data.forEach(el => {
      if (this.currTab == 'movies') {
        title = el.title;
      } else {
        title = el.name;
      }
      let data = {
        id: el.id,
        title: title,
        poster: el.poster_path,
        overview: el.overview,
        rating: el.vote_average,
        votes: el.vote_count,
        userRating: 0,
        userRatingObject: { rating: 0 }
      }
      if (this.user) {
        el.ratings.forEach(el2 => {
          if (el2.userId == this.user.id) {
            data.userRating = el2.rating;
            data.userRatingObject = el2;
          }
        })
      }
      this.data.push(data);
    });
  }

  
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
