package dipl.spi.spi_backend.service;

import dipl.spi.spi_backend.dto.ArticleDto;
import dipl.spi.spi_backend.exception.ApiBadRequestException;
import dipl.spi.spi_backend.exception.ApiNotFoundException;
import dipl.spi.spi_backend.model.AppUser;
import dipl.spi.spi_backend.model.Article;
import dipl.spi.spi_backend.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ArticleService {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private AppUserService userService;

    private static final int elementsPerPage = 6;


    public List<ArticleDto> getUserArticles(Long userId, int pageNum) {

        if(pageNum < 0) {
            throw new ApiBadRequestException("Invalid page number");
        }

        Pageable pageable = PageRequest.of(pageNum, elementsPerPage);

        return articleRepository
                .findByUserId(userId, pageable)
                .stream()
                .map(ArticleDto::new)
                .collect(Collectors.toList());
    }


    public Article findById(Long articleId) {
        Optional<Article> optArticle = articleRepository.findById(articleId);
        if(optArticle.isEmpty()) {
            throw new ApiNotFoundException("Failed to find article with id " + articleId);
        }
        return optArticle.get();
    }


    public ArticleDto createArticle(ArticleDto articleDto, Long userId) {

        AppUser user = userService.findUserById(userId);
        Article article = new Article(articleDto, user);

        try {
            return new ArticleDto(articleRepository.save(article));
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ApiBadRequestException("Failed to save article. Please refresh the page and try again");
        }

    }
}
