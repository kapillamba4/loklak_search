import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SearchService } from '../shared/services';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
	private query: string = null;
	private search_metadata: JSON = null;	// Temporarily as a JSON in future it will be a model object
	private search_results: Array<JSON> = new Array(); // Temporarily as a JSON in future it will be a model object

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private location: Location,
		private searchService: SearchService,
		private elementRef: ElementRef
	) { }

	ngOnInit() {
		this.focusTextbox();
		this.getQueryString();
		if (this.query) {	// Only load the results if query is truthy.
			this.loadResults();
		}
	}

	private focusTextbox() {
		this.elementRef.nativeElement.querySelector('feed-header input#search').focus();
	}

	private getQueryString() {
		this.route.queryParams.subscribe((params: Params) => {
				this.query = params['query'];
			});
	}

	private loadResults() {
		this.searchService.fetchQuery(this.query)
											.subscribe((fetchedResults: JSON) => {
												this.search_metadata = fetchedResults['search_metadata'];
												this.search_results = fetchedResults['statuses'];
												console.log(this.search_results);
											});
	}

	private handleQueryRequest(event: any) {
		if (this.query !== event.query) {
			this.query = event.query;
			this.loadResults();
			this.location.go('/search', `query=${this.query}`);
		}
	}
}