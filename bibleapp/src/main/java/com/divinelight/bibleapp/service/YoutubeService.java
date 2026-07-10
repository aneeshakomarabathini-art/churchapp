package com.divinelight.bibleapp.service;

import com.divinelight.bibleapp.dto.YoutubeMetaResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class YoutubeService {
    private final ObjectMapper objectMapper = new ObjectMapper();

    public YoutubeMetaResponse getMetadata(String youtubeUrl) {
        String url = youtubeUrl == null ? "" : youtubeUrl.trim();
        String videoId = extractVideoId(url);
        if (videoId.isBlank()) throw new RuntimeException("Please enter a valid YouTube link");

        String fallbackTitle = "YouTube Video";
        String fallbackDescription = "YouTube video uploaded by church admin.";
        String fallbackThumbnail = "https://img.youtube.com/vi/" + videoId + "/hqdefault.jpg";

        try {
            String oembed = UriComponentsBuilder.fromUriString("https://www.youtube.com/oembed")
                    .queryParam("url", url)
                    .queryParam("format", "json")
                    .build()
                    .toUriString();
            HttpRequest request = HttpRequest.newBuilder().uri(URI.create(oembed)).GET().build();
            HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode json = objectMapper.readTree(response.body());
                String title = json.path("title").asText(fallbackTitle);
                String author = json.path("author_name").asText("");
                String thumb = json.path("thumbnail_url").asText(fallbackThumbnail);
                String description = author.isBlank() ? fallbackDescription : "YouTube video from " + author + ".";
                return new YoutubeMetaResponse(url, videoId, title, description, thumb, author);
            }
        } catch (Exception ignored) {}
        return new YoutubeMetaResponse(url, videoId, fallbackTitle, fallbackDescription, fallbackThumbnail, "");
    }

    public String extractVideoId(String input) {
        if (input == null) return "";
        String raw = input.trim();
        Pattern[] patterns = new Pattern[] {
                Pattern.compile("youtu\\.be/([A-Za-z0-9_-]{6,})"),
                Pattern.compile("youtube\\.com/watch\\?v=([A-Za-z0-9_-]{6,})"),
                Pattern.compile("youtube\\.com/embed/([A-Za-z0-9_-]{6,})"),
                Pattern.compile("youtube\\.com/shorts/([A-Za-z0-9_-]{6,})"),
                Pattern.compile("youtube\\.com/live/([A-Za-z0-9_-]{6,})")
        };
        for (Pattern p : patterns) {
            Matcher m = p.matcher(raw);
            if (m.find()) return m.group(1);
        }
        return "";
    }
}
