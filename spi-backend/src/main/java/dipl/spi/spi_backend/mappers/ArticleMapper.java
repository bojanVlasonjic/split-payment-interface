package dipl.spi.spi_backend.mappers;

import dipl.spi.spi_backend.dto.ArticleDto;
import dipl.spi.spi_backend.dto.ArticlePageDto;
import dipl.spi.spi_backend.model.AppUser;
import dipl.spi.spi_backend.model.Article;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ArticleMapper {

    @Autowired
    private PaymentSplitMapper paymentSplitMapper;

    public Article articleDtoToArticle(ArticleDto articleDto, AppUser user) {

        Article article = new Article();

        article.setId(articleDto.getId());
        article.setName(articleDto.getName());
        article.setPrice(articleDto.getPrice());
        article.setUser(user);

        return article;
    }

    public ArticleDto articleToArticleDto(Article article) {

        ArticleDto articleDto = new ArticleDto();

        articleDto.setId(article.getId());
        articleDto.setName(article.getName());
        articleDto.setPrice(article.getPrice());
        articleDto.setUserId(article.getUser().getId());

        articleDto.setPaymentSplits(
                article.getPaymentSplits()
                .stream()
                .map(ps -> paymentSplitMapper.paymentSplitToPaymentSplitDto(ps))
                .collect(Collectors.toList())
        );

        return articleDto;
    }

    public ArticlePageDto articlePageToArticlePageDto(Page<Article> articlePage) {
        ArticlePageDto articlePageDto = new ArticlePageDto();

        articlePageDto.setTotalPages(articlePage.getTotalPages());
        articlePageDto.setPageNumber(articlePage.getNumber());

        articlePageDto.setArticles(
                articlePage.getContent()
                .stream()
                .map(this::articleToArticleDto)
                .collect(Collectors.toList())
        );

        return articlePageDto;
    }

}
