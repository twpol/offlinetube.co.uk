#!/usr/bin/perl

use strict;
use warnings;
use vars qw/$http_params/;

sub main() {
	my @dataPaths = (
		"/var/www/hosts/offlinetube.co.uk/data/upload/",
	);
	my $dataPath = "";
	my $maxFileSize = 100 * 1024; # 100KB
	my $errorString = "";
	my $filename = "";

	processHTTPParams();

	# Select data path.
	foreach (@dataPaths) {
		$dataPath = $_ if -d;
	}
	if ($dataPath) {
		$filename = $http_params->{key} . '.json';

		if ($http_params->{key} !~ /^[a-zA-Z0-9-]+$/) {
			$errorString = "Invalid 'key' parameter";
		} elsif ($http_params->{PostDataType} !~ /^[-\w]+\/[-\w]+$/) {
			$errorString = "Invalid MIME type: $http_params->{PostDataType}";
		} elsif (($http_params->{PostDataType} ne "application/json")) {
			$errorString = "Unsupported MIME type (" . $http_params->{PostDataType} . ")";
		} else {
			if (open(DF, '>', $dataPath . $filename)) {
				binmode(DF);
				print DF $http_params->{PostData};
				close(DF);
				chmod(0600, $dataPath . $filename);
			} else {
				$errorString = "$!";
			}
		}
	} else {
		$errorString = "Unable to find upload data directory";
	}

	binmode(STDOUT);
	if ($errorString) {
		header("Status: 400 $errorString");
	} else {
		header("Status: 200 OK");
	}
	header("Content-Type: text/plain; charset=UTF-8");
	header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
	header("Cache-Control: no-cache, must-revalidate");
	header("Pragma: no-cache");
	header();
}

sub header($) {
	print(($_[0] || "") . "\015\012");
}

sub bodyline($) {
	print(($_[0] || "") . "\015\012");
}

sub urlencode($) {
	my ($data) = @_;

	$data =~ s/([^-_a-z0-9])/"%".sprintf("%x", ord($1))/gei;

	return $data;
}

sub jsescape($) {
	my ($data) = @_;

	$data =~ s/\r/\\r/g;
	$data =~ s/\n/\\n/g;
	$data =~ s/'/\\'/g;

	return $data;
}

sub processHTTPParams() {
	$http_params = {};

	splitURLEncodedBlock($ENV{QUERY_STRING}) if $ENV{QUERY_STRING};

	my $postdata;
	if ($ENV{CONTENT_LENGTH} > 0) {
		binmode(STDIN);
		read(STDIN, $postdata, $ENV{CONTENT_LENGTH});
	}
	$ENV{CONTENT_LENGTH} = 0;

	if ($postdata) {
		my $type = $ENV{CONTENT_TYPE};
		my $boundary = $1 if ($type =~ /; boundary=([^; ]*)/);
		$type =~ s/;.*//;

		$http_params->{PostData} = $postdata;
		$http_params->{PostDataType} = $type;
		$http_params->{PostDataMultipartBoundary} = $boundary;
	}
}

sub splitURLEncodedBlock($) {
	foreach my $item (split(/&/, $_[0])) {
		if ($item =~ /^(\w+)=(.*)$/) {
			$http_params->{$1} = decodeHTTP($2);
		}
	}
}

sub decodeHTTP($) {
	my ($data) = @_;

	$data =~ s/\+/ /g;
	$data =~ s/%([0-9A-F][0-9A-F])/sprintf('%c', hex($1))/gei;

	return $data;
}

main();
